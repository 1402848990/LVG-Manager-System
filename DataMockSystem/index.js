/**
 *@description 模拟用户下单server
 */
const Koa = require('koa')
const models = require('../autoScanModels')
const { OrderModel, MachineModel, GoodsModel, AssetModel } = models
const { mysqlCreate, userQuery, userQueryOne } = require('../utils')
const moment = require('moment')
const { sampleSize, sample } = require('lodash')
const Sequelize = require('sequelize')

const app = new Koa()
const Op = Sequelize.Op

// 服务启动时间
const now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
console.log(`模拟用户下单服务启动----${now}`)

setInterval(dataWrite, 2000)

app.listen(8090)

// 写入数据
async function dataWrite() {
  try {
    // 获取所有开机机器
    const _resMachineList = await MachineModel.findAll({
      where: {
        status: 1,
        goodIds: {
          [Op.not]: null,
        },
      },
    })
    const machineList = JSON.parse(JSON.stringify(_resMachineList))

    // 随机提取50%的机器
    const selectedMachineList = sampleSize(
      machineList,
      Math.floor(machineList.length / 2)
    )
    // console.log('selectedMachineList', selectedMachineList)

    selectedMachineList.forEach(async (item) => {
      // 获取当前机器下 已经上架 && 有库存 的商品
      let filter = {}
      const { goodIds, id: machineId, name: machineName, local, localId } = item
      filter.id = {
        [Op.in]: goodIds.split(',') || [],
      }
      delete filter.ids
      const _goods = await userQuery(
        GoodsModel,
        { ...filter },
        { order: [['id', 'DESC']] }
      )
      const goodList = JSON.parse(JSON.stringify(_goods))
      // console.log('goodList', goodList.length)
      // 选中的商品 从所有商品中随机选取 1/4
      const selectedGoodList = sampleSize(
        goodList,
        Math.floor(goodList.length / 4) + 1
      )
      // console.log('selectedGoodList', selectedGoodList)
      selectedGoodList.forEach(async (good) => {
        let nows = `${Date.now()}`.split(`${Date.now().toString().slice(0,3)}`)[1]
        nows?null : nows = 
        console.log('nows',nows)
        const {
          stock,
          rootPrice,
          salePrice,
          isDiscount,
          price,
          id: goodId,
          salesNum = 0,
        } = good
        good.goodName = good.name
        delete good.name
        delete good.id
        delete good.updatedAt
        delete good.createdAt
        delete good.stock
        delete good.desc
        delete good.salesNum
        !isDiscount ? delete good.salePrice : null
        // 生成随机购买数量
        const goodsNum = randomNum(0, (stock > 3 ? 3 : stock) || 1) || 1
        console.log('goodsNum', goodsNum)
        const amount = goodsNum * (isDiscount ? salePrice : price) // 总金额
        const profit = ((isDiscount ? salePrice : price) - rootPrice) * goodsNum // 总利润
        const payWay = sample([0, 1]) // 支付方式
        // 写入到数据库
        const data = {
          ...good,
          machineId,
          machineName,
          localId,
          local,
          amount,
          goodsNum,
          profit,
          payWay,
          id: nows,
        }
        if (stock - goodsNum > 0) {
          await mysqlCreate(OrderModel, data)
          // 添加到账目
          await mysqlCreate(AssetModel, {
            amount,
            payWay,
            orderId: nows,
          })
          // 减库存 更新销量
          await GoodsModel.update(
            {
              stock: stock - goodsNum,
              salesNum: (salesNum || 0) + goodsNum,
            },
            {
              where: {
                id: goodId,
              },
            }
          )
          console.log('下单成功：', data)
        }
      })
    })
  } catch (e) {
    console.log('下单报错：', e)
  }
}

// 根据不同的概率生成不同范围的随机数
/**
  60%：13-35
  20%：5-13
  15%：35-50
  4%： 50-70
  1%： 70-90
 */
function proRandom() {
  const random = Math.floor(Math.random() * 100)
  if (random < 60) {
    return proNum(13, 35)
  } else if (random >= 60 && random < 80) {
    return proNum(5, 13)
  } else if (random >= 80 && random < 95) {
    return proNum(35, 50)
  } else if (random >= 95 && random < 99) {
    return proNum(50, 70)
  } else {
    return proNum(70, 95)
  }
}

// 生成两个范围之间的随机整数
function randomNum(min, max) {
  return Math.round(Math.random() * (max - min + 1) + min)
}

// 生成两个范围之间的随机两位小数
function proNum(min, max) {
  return (Math.random() * (max - min + 1) + min).toFixed(2)
}