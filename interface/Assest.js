/**
 *  学生相关接口（成绩、列表、课程等）
 */
const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../autoScanModels')
const { AssetModel } = models
const { mysqlCreate, userQuery, userQueryOne } = require('../utils')

const Op = Sequelize.Op

/**
 *  POST api/Assest/getAll
 *  获取所有账单明细
 */
router.post('/getAll', async (ctx) => {
  // 根据id倒序
  const data = await userQuery(AssetModel,{}, { order: [['id', 'DESC']] })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

module.exports = router.routes()
