/**
 * @description User 接口(注册，登录，token验证)
 */
const router = require('koa-router')()
const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')
const axios = require('axios')
const models = require('../autoScanModels')
const { UserModel, LoginLogModel } = models
const {
  userCreate,
  userQuery,
  userQueryOne,
} = require('../utils')

const Op = Sequelize.Op

/**
 * @router POST api/User/userInfo
 * @description 返回用户信息
 */
router.post('/userInfo', async (ctx) => {
  const { nickName } = ctx.request.body
  const info = await userQueryOne(UserModel, { nickName })
  console.log('info...', info)
  ctx.body = {
    success: true,
    info,
  }
})

/**
 * @router POST api/User/editUserInfo
 * @description 修改用户信息
 */
router.post('/editUserInfo', async (ctx) => {
  const { changeData, nickName } = ctx.request.body
  console.log('changeData', changeData)
  const info = await UserModel.update(
    { ...changeData },
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
 * @route api/User/register
 * @description 注册接口
 */
router.post('/register', async (ctx) => {
  console.log('register请求：', ctx.request.body)
  const { nickName, sex } = ctx.request.body
  // 加密密码
  // const hashPassword = bcrypt.hashSync(passWord, 10);
  try {
    // 查询数据库是否已经存在相同的手机号或者用户名
    const repeat = await userQueryOne(UserModel, {
      [Op.or]: [{ nickName }],
    })
    console.log('repeat...', repeat)
    if (repeat) {
      // 手机号或用户名已存在
      ctx.status = 200
      ctx.body = {
        success: false,
        message: '该账户已创建',
      }
    } else {
      // 可以注册
      const res = await userCreate(UserModel, {
        nickName,
        sex,
        amount: 100,
      })
      ctx.status = 200
      ctx.body = {
        success: true,
        message: '恭喜您~账户创建成功！',
      }
    }
  } catch (err) {
    console.log('err', err)
    ctx.status = 500
    ctx.body = '服务器错误!'
  }
})

/**
 * @router POST api/User/userList
 * @description 获取所有用户列表
 */
router.post('/userList', async (ctx) => {
  const { nickName, filter } = ctx.request.body
  const info = await userQuery(UserModel, { ...filter })
  console.log('info...', info)
  ctx.body = {
    success: true,
    info,
  }
})

module.exports = router.routes()
