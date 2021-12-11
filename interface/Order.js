/**
 *  订单相关接口
 */
const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../autoScanModels')
const { OrderModel } = models
const { mysqlCreate, userQuery, userQueryOne } = require('../utils')
const moment = require('moment')

const Op = Sequelize.Op

/**
 *  POST api/Order/add
 *  新增订单
 */
router.post('/add', async (ctx) => {
  const request = ctx.request.body
  console.log('request', request)
  await mysqlCreate(OrderModel, request)
  ctx.status = 200
  ctx.body = {
    success: true,
  }
})

/**
 *  POST api/Order/getAll
 *  获取所有订单
 */
router.post('/getAll', async (ctx) => {
  const { filter } = ctx.request.body
  const { goodName, target, cellNum, timeRange } = filter || {}
  // 名字
  if (goodName) {
    filter.goodName = {
      [Op.like]: `%${goodName}%`,
    }
  }

  if (goodName === '') {
    delete filter.goodName
  }

  // 目标区间筛选
  if (target) {
    filter.target = {
      [Op.between]: target,
    }
  }

  // 下单时间区间
  if (timeRange) {
    filter.createdAt = {
      [Op.between]: timeRange,
    }
    delete filter.timeRange
  }

  // 橱窗数量
  if (cellNum) {
    filter.cellNum = {
      [Op.between]: cellNum,
    }
  }

  // 从数据库中查询并根据id倒序
  const data = await userQuery(
    OrderModel,
    { ...filter },
    { order: [['id', 'DESC']] }
  )

  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/Order/detail
 *  返回订单详情
 */
router.post('/detail', async (ctx) => {
  const { id } = ctx.request.body
  const data = await userQueryOne(OrderModel, { id })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/Order/delete
 *  删除订单
 */
router.post('/delete', async (ctx) => {
  const { id } = ctx.request.body
  const data = await OrderModel.destroy({ where: { id } })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/Order/update
 *  修改订单信息
 */
router.post('/update', async (ctx) => {
  const changeData = ctx.request.body
  const { id } = changeData
  delete changeData.id
  console.log('changeData', changeData)
  await OrderModel.update(
    { ...changeData },
    {
      where: {
        id,
      },
    }
  )
  ctx.status = 200
  ctx.body = {
    success: true,
  }
})

module.exports = router.routes()
