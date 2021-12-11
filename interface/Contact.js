/**
 *  User 接口(注册，登录、工作计划、备忘录、通讯录等)
 */
const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../autoScanModels')
const { UserModel, ContactModel,NoteModel,PlanModel } = models
const { mysqlCreate, userQuery, userQueryOne, userDelete } = require('../utils')

const Op = Sequelize.Op

/**
 *  POST api/User/contactList
 *  获取所有联系人列表
 */
router.post('/contactList', async (ctx) => {
  
  const { filter } = ctx.request.body
  // 根据id倒序
  const data = await userQuery(
    ContactModel,
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
 *  POST api/User/addContact
 *  新建联系人
 */
router.post('/addContact', async (ctx) => {
 
  const request = ctx.request.body

  const data = await mysqlCreate(ContactModel, request)
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/deleteContact
 *  删除联系人
 */
router.post('/deleteContact', async (ctx) => {
  const { id } = ctx.request.body
  const data = await ContactModel.destroy({ where: { id } })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/updateContact
 *  修改联系人信息
 */
router.post('/updateContact', async (ctx) => {
  const changeData = ctx.request.body
  const { id } = changeData
  delete changeData.id
  await ContactModel.update(
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
