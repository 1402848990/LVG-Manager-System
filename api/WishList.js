/**
 * @description wishList 接口(心愿列表)
 */

const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../models')
const { WishListModel } = models
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
 * @description 创建心愿
 */
router.post('/addWish', async (ctx) => {
  const wishInfo = ctx.request.body
  wishInfo.status = 0
  console.log('wishInfo', wishInfo)

  try {
    const res = await userCreate(WishListModel, { ...wishInfo })
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
    const res = await WishListModel.update(
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
 * @description 获取所有心愿接口
 */
router.post('/getWishList', async (ctx) => {
  const { userName } = ctx.request.body

  try {
    const res = await userQuery(
      WishListModel,
      {
        userName,
      },
      {
        order: [['wishLevel','DESC'],['wishPrice']],
      }
    )
    console.log('res', res)
    ctx.status = 200
    ctx.body = {
      success: true,
      data: res,
    }
  } catch (e) {
    console.log('获取心愿列表接口报错：', e)
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
    const res = await WishListModel.destroy({
      where: {
        id,
      },
    })
    console.log('删除res', res);
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
