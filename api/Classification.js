/**
 * @description 支出、收入类型 接口
 */

const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../models')
const { ClassificationModel } = models
const {
  userCreate,
  userBulkCreate,
  userQuery,
  userQueryOne,
  userUpdate,
  userBulkUpdate,
  userDelete,
  getClientIP,
} = require('../utils')

const Op = Sequelize.Op

/**
 * @description 创建支出/收入类型接口
 */
router.post('/addClassification', async (ctx) => {
  const classificationInfo = ctx.request.body
  classificationInfo.icon = `/assets/icon/${
    classificationInfo.type === 'pay' ? 'payType' : 'incomeType'
  }.png`
  console.log('classificationInfo', classificationInfo)

  try {
    const res = await userCreate(ClassificationModel, { ...classificationInfo })
    console.log('-------res', res)
    ctx.status = 200
    ctx.body = {
      success: true,
    }
  } catch (e) {
    ctx.status = 500
    ctx.body = {
      success: false,
    }
  }
})

/**
 * @description 获取所有支出/收入类型接口
 */
router.post('/getAllClassification', async (ctx) => {
  const { userName, type } = ctx.request.body

  try {
    const res = await userQuery(
      ClassificationModel,
      {
        userName: { [Op.in]: [userName, 'admin'] },
        type,
      },
      {
        order: [['id']],
      }
    )
    console.log('res', res)
    ctx.status = 200
    ctx.body = {
      success: true,
      data: res,
    }
  } catch (e) {
    console.log('获取类型接口报错：', e)
    ctx.status = 500
    ctx.body = {
      success: false,
    }
  }
})


module.exports = router.routes()
