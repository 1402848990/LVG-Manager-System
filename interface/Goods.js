/**
 *  商品相关接口
 */
const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../autoScanModels')
const { GoodsModel, MachineModel } = models
const { mysqlCreate, userQuery, userQueryOne } = require('../utils')

const Op = Sequelize.Op

/**
 *  POST api/Goods/add
 *  新增商品
 */
router.post('/add', async (ctx) => {
  const request = ctx.request.body
  console.log('request', request)
  await mysqlCreate(GoodsModel, request)
  ctx.status = 200
  ctx.body = {
    success: true,
  }
})

/**
 *  POST api/Goods/getAll
 *  获取所有商品
 */
router.post('/getAll', async (ctx) => {
  const { filter } = ctx.request.body
  const { name, ids, rootId } = filter || {}
  if (name) {
    filter.name = {
      [Op.like]: `%${name}%`,
    }
  }

  if (ids) {
    filter.id = {
      [Op.in]: ids,
    }
    delete filter.ids
  }

  if (name === '') {
    delete filter.name
  }

  if (rootId) {
    const _machineDetail = await userQueryOne(MachineModel, { id: rootId })
    const machineDetail = JSON.parse(JSON.stringify(_machineDetail))
    console.log('machineDetail', machineDetail)
    const { goodIds } = machineDetail
    filter.id = {
      [Op.in]: goodIds?.split(',') || [],
    }
    delete filter.rootId
  }

  // 从数据库中查询并根据id倒序
  const data = await userQuery(
    GoodsModel,
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
 *  POST api/Goods/detail
 *  返回商品详情
 */
router.post('/detail', async (ctx) => {
  const { id } = ctx.request.body
  const data = await userQueryOne(GoodsModel, { id })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/Goods/delete
 *  删除商品
 */
router.post('/delete', async (ctx) => {
  const { id } = ctx.request.body
  const data = await GoodsModel.destroy({ where: { id } })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/Goods/update
 *  修改商品信息
 */
router.post('/update', async (ctx) => {
  const changeData = ctx.request.body
  const { id } = changeData
  delete changeData.id
  console.log('changeData', changeData)
  await GoodsModel.update(
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
