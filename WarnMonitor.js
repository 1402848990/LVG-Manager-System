/**
 * @description 预警监控
 */
const Sequelize = require('sequelize')
const models = require('./autoScanModels')
const { GoodsModel } = models
const {
  userCreate,
  userQuery,
  userQueryOne,
} = require('./utils')
const Op = Sequelize.Op

setInterval(scan, 3000)
scan()

// 扫描数据库数据，是否有达到预警触发值并且开启预警
async function scan() {
  // 当前时间
  const NOW = Date.now()

  // 获取所有商品
  const _goods = await userQuery(GoodsModel)
  const goods = JSON.parse(JSON.stringify(_goods))

  // 库存预警列表
  const stockWarnGoods = goods.filter((i) => i.stock <= 20)
  const stockWarnGoodsIds = stockWarnGoods.map((i) => i.id)
  // 库存预警后补齐的商品
  const removeStockWarnGoods = goods.filter((i) => i.stock >20 && i.stockWarn)
  // console.log('removeStockWarnGoods', removeStockWarnGoods)
  // 临期预警列表
  const expiresWarnGoods = goods.filter(
    (i) => (i.expiresAt - NOW) < 1000 * 60 * 60 * 24 * 3
  )
  const expiresWarnGoodsIds = expiresWarnGoods.map((i) => i.id)
  const removeStockWarnGoodsIds = removeStockWarnGoods.map((i) => i.id)

  // console.log('goods', goods)

  await GoodsModel.update(
    { stockWarn: 1 },
    {
      where: {
        id: {
          [Op.in]: stockWarnGoodsIds || [],
        },
      },
    }
  )

  await GoodsModel.update(
    { stockWarn: 0 },
    {
      where: {
        id: {
          [Op.in]: removeStockWarnGoodsIds || [],
        },
      },
    }
  )

  console.log('库存预警：', stockWarnGoodsIds)

  await GoodsModel.update(
    {
      expiresWarn: 1,
    },
    {
      where: {
        id: {
          [Op.in]: expiresWarnGoodsIds || [],
        },
      },
    }
  )

  console.log('临期预警：', expiresWarnGoodsIds)

}
