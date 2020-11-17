/**
 * @description 充值 接口(钱包)
 */

const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../autoScanModels')
const { RechargeRecordModel, UserModel } = models
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
 * @description 充值、支付方法
 */
router.post('/recharge', async (ctx) => {
  let { money, nickName, type } = ctx.request.body
  money = Number(money)
  type = Number(type)

  try {
    const res = await userCreate(RechargeRecordModel, { money, nickName, type })
    // 获取账户之前的余额 并将新的余额更新到数据库user表
    const userInfo = await userQueryOne(UserModel, { nickName })
    let { amount } = userInfo.toJSON()
    amount = type === 1||'1' ? amount + money : amount - money
    await UserModel.update(
      { amount },
      {
        where: {
          nickName,
        },
      }
    )
    console.log('-------res', res)
    ctx.status = 200
    ctx.body = {
      success: true,
    }
  } catch (e) {
    console.log(e)
    ctx.status = 500
    ctx.body = {
      success: false,
    }
  }
})

/**
 * @description 修改主机配置接口
 */
router.post('/editHost', async (ctx) => {
  // 拿到ID和修改的数据
  const { id, hostInfo } = ctx.request.body
  // hostInfo.openAt = Date.now();
  // hostInfo.closeAt = 0;
  // hostInfo.password = 123456;
  console.log(hostInfo, id)

  try {
    const res = await RechargeRecordModel.update(
      { ...hostInfo },
      { where: { id } }
    )
    console.log('-------res', res)
    ctx.status = 200
    ctx.body = {
      success: true,
      id,
    }
  } catch (e) {
    console.log('编辑host报错：', e)
    ctx.status = 500
    ctx.body = {
      success: false,
    }
  }
})

/**
 * @description 获取充值记录
 */
router.post('/getRecord', async (ctx) => {
  const { nickName,type } = ctx.request.body

  try {
    const res = await userQuery(
      RechargeRecordModel,
      {
        nickName,
        type
      },
      {
        order: [['id', 'DESC']],
      }
    )
    console.log('res', res)
    ctx.status = 200
    ctx.body = {
      success: true,
      data: res,
    }
  } catch (e) {
    console.log('获取充值记录接口报错：', e)
    ctx.status = 500
    ctx.body = {
      success: false,
    }
  }
})

/**
 * @description 删除心愿接口
 */
router.post('/deleteWish', async (ctx) => {
  const { id } = ctx.request.body
  console.log('id', id)
  try {
    const res = await RechargeRecordModel.destroy({
      where: {
        id,
      },
    })
    console.log('删除res', res)
    ctx.status = 200
    ctx.body = {
      success: true,
      data: res,
    }
  } catch (e) {
    console.log('删除心愿接口报错：', e)
    ctx.status = 500
    ctx.body = {
      success: false,
    }
  }
})

module.exports = router.routes()
