/**
 * @description Urgent 接口(紧急联系人)
 */
const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../autoScanModels')
const { UrgentModel, LoginLogModel } = models
const {
  userCreate,
  userQueryOne,
} = require('../utils')

const Op = Sequelize.Op

/**
 * @router POST api/Urgent/get
 * @description 返回紧急联系人信息
 */
router.post('/get', async (ctx) => {
  const { nickName } = ctx.request.body
  const info = await userQueryOne(UrgentModel, { nickName })
  console.log('info...', info)
  ctx.body = {
    success: true,
    info,
  }
})

/**
 * @router POST api/Urgent/edit
 * @description 修改紧急联系人信息
 */
router.post('/edit', async (ctx) => {
  const { urgentName, nickName, urgentPhone } = ctx.request.body
  const info = await UrgentModel.update(
    { urgentName, urgentPhone },
    {
      where: {
        nickName,
      },
    }
  )
  ctx.body = {
    success: true,
    info,
  }
})

/**
 * @route api/Urgent/add
 * @description 添加紧急联系人
 */
router.post('/add', async (ctx) => {
  const { nickName, urgentName, urgentPhone } = ctx.request.body
  try {
    // 查询数据库是否已经存在相同的手机号或者用户名
    const repeat = await userQueryOne(UrgentModel, {
      [Op.or]: [{ nickName }],
    })
    console.log('repeat...', repeat)
    if (repeat) {
      ctx.status = 200
      ctx.body = {
        success: false,
        message: '该账紧急联系人已添加',
      }
    } else {
      // 可以注册
      const res = await userCreate(UrgentModel, {
        nickName,
        urgentName,
        urgentPhone,
      })
      ctx.status = 200
      ctx.body = {
        success: true,
        message: '紧急联系人添加成功',
      }
    }
  } catch (err) {
    console.log('err', err)
    ctx.status = 500
    ctx.body = '服务器错误!'
  }
})

module.exports = router.routes()
