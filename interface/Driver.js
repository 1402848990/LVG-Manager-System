/**
 * @description DRIVER 接口(注册，登录)
 */
const router = require('koa-router')()
const Sequelize = require('sequelize')
const axios = require('axios')
const models = require('../autoScanModels')
const { DriverModel, LoginLogModel } = models
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
 * @router POST api/User/userInfo
 * @description 返回用户信息
 */
router.post('/userInfo', async (ctx) => {
  const { nickName } = ctx.request.body
  const info = await userQueryOne(DriverModel, { nickName })
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
  const { changeData ,nickName} = ctx.request.body
  console.log('changeData', changeData)
  const info = await DriverModel.update(
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
    const repeat = await userQueryOne(DriverModel, {
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
      const res = await userCreate(DriverModel, {
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

// 获取登录信息
async function getGps(ip) {
  ip.includes('::1') ? (ip = '') : null
  const token = '407a2cf82309f*******61b776'
  const res = await axios.get(
    `http://api.ip138.com/query/?ip=${ip}&token=${token}`
  )
  console.log('-----------res', res.data)
  return `${res.data.data[1]}省${res.data.data[2]}市`
}

module.exports = router.routes()
