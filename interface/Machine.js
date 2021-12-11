/**
 *  机器相关接口
 */
const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../autoScanModels')
const { MachineModel } = models
const { mysqlCreate, userQuery, userQueryOne } = require('../utils')

const Op = Sequelize.Op

/**
 *  POST api/Machine/add
 *  新增机器
 */
router.post('/add', async (ctx) => {
  const request = ctx.request.body
  console.log('request', request)
  await mysqlCreate(MachineModel, request)
  ctx.status = 200
  ctx.body = {
    success: true,
  }
})

/**
 *  POST api/Machine/getAll
 *  获取所有机器
 */
router.post('/getAll', async (ctx) => {
  const { filter } = ctx.request.body
  const { name,target,cellNum } = filter || {}
  // 名字
  if (name) {
    filter.name = {
      [Op.like]: `%${name}%`,
    }
  }

  if(name===''){delete filter.name}

  // 目标区间筛选
  if(target){
    filter.target = {
      [Op.between]:target
    }
  }

  // 橱窗数量
  if(cellNum){
    filter.cellNum = {
      [Op.between]:cellNum
    }
  }

  // 从数据库中查询并根据id倒序
  const data = await userQuery(
    MachineModel,
    { ...filter},
    { order: [['id', 'DESC']] }
  )

  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})


/**
 *  POST api/Machine/detail
 *  返回机器详情
 */
 router.post('/detail', async (ctx) => {
  const { id } = ctx.request.body
  const data = await userQueryOne(MachineModel, { id })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/Machine/delete
 *  删除机器
 */
router.post('/delete', async (ctx) => {
  const { id } = ctx.request.body
  const data = await MachineModel.destroy({ where: { id } })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/Machine/update
 *  修改机器信息
 */
 router.post('/update', async (ctx) => {
  const changeData = ctx.request.body
  const { id } = changeData
  delete changeData.id
  console.log('changeData', changeData)
  await MachineModel.update(
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
