/**
 *  类目相关接口
 */
const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../autoScanModels')
const { CategoryModel } = models
const { mysqlCreate, userQuery, userQueryOne } = require('../utils')

const Op = Sequelize.Op

/**
 *  POST api/Category/add
 *  新增类目
 */
router.post('/add', async (ctx) => {
  const request = ctx.request.body
  console.log('request', request)
  await mysqlCreate(CategoryModel, request)
  ctx.status = 200
  ctx.body = {
    success: true,
  }
})

/**
 *  POST api/Category/getAll
 *  获取所有类目
 */
router.post('/getAll', async (ctx) => {
  // 根据id倒序
  const data = await userQuery(CategoryModel)
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/Category/delete
 *  删除类目
 */
router.post('/delete', async (ctx) => {
  const { id } = ctx.request.body
  const data = await CategoryModel.destroy({ where: { id } })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

module.exports = router.routes()
