/**
 *  User 接口(注册，登录、工作播报、备忘录、通讯录等)
 */
const router = require('koa-router')()
const Sequelize = require('sequelize')
const axios = require('axios')
const md5 = require('md5')
const models = require('../autoScanModels')
const { UserModel, MessageModel, NoteModel, GlobalNoticeModel } = models
const { userCreate, userQuery, userQueryOne, userDelete } = require('../utils')

const Op = Sequelize.Op

/**
 *  POST api/Global/globalViewData
 *  获取总览数据
 */
router.post('/globalViewData', async (ctx) => {
  const { date } = ctx.request.body
  const res = await axios.get(
    `http://api.tianapi.com/ncov/index?key=d3399928c10cc557a6dd52949ff510d2&date=${date}`
  )
  console.log('res', res)
  ctx.status = 200
  ctx.body = {
    success: true,
    data: res.data.newslist[0],
  }
})

/**
 *  POST api/Global/cityData
 *  获取城市疫情数据
 */
router.post('/allCityData', async (ctx) => {
  const res = await axios.get(
    `https://rijb.api.storeapi.net/api/94/219?format=json&appid=13463&sign=${md5(
      `appid13463formatjson53ac8bcc1085c2a596858b56ae6997ea`
    )}`
  )
  console.log('res', res)
  ctx.status = 200
  ctx.body = {
    success: true,
    data: res.data.retdata,
  }
})

/**
 *  POST api/User/messageList
 *  获取所有通告列表
 */
router.post('/messageList', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const { filter } = ctx.request.body
  // 根据id倒序
  const data = await userQuery(
    MessageModel,
    { ...filter, userId: id },
    { order: [['id', 'DESC']] }
  )
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/getSiteMessage
 *  获取启用的通告列表
 */
router.post('/getSiteMessage', async (ctx) => {
  const data = await userQuery(
    MessageModel,
    { status: 1 },
    { order: [['id', 'DESC']] }
  )
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/addMessage
 *  新建通告
 */
router.post('/addMessage', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const request = ctx.request.body
  request.userId = id
  const data = await userCreate(MessageModel, request)
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/deleteMessage
 *  删除通告
 */
router.post('/deleteMessage', async (ctx) => {
  const { id } = ctx.request.body
  const data = await MessageModel.destroy({ where: { id } })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/updateMessage
 *  修改通告信息
 */
router.post('/updateMessage', async (ctx) => {
  const changeData = ctx.request.body
  const { id } = changeData
  delete changeData.id
  await MessageModel.update(
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

/**
 *  POST api/User/noteList
 *  获取所有备忘录列表
 */
router.post('/noteList', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const { filter } = ctx.request.body
  // 根据id倒序
  const data = await userQuery(
    NoteModel,
    { ...filter, userId: id },
    { order: [['id', 'DESC']] }
  )
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/deleteNote
 *  删除备忘录
 */
router.post('/deleteNote', async (ctx) => {
  const { id } = ctx.request.body
  const data = await NoteModel.destroy({ where: { id } })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/addNote
 *  新建备忘录
 */
router.post('/addNote', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const request = ctx.request.body
  request.userId = id
  const data = await userCreate(NoteModel, request)
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/updateNote
 *  修改备忘录
 */
router.post('/updateNote', async (ctx) => {
  const changeData = ctx.request.body
  const { id } = changeData
  delete changeData.id
  await NoteModel.update(
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


/**
 *  POST api/User/siteGlobalNoticeList
 *  站点全国播报列表
 */
 router.post('/siteGlobalNoticeList', async (ctx) => {
  // 根据id倒序
  const data = await userQuery(
    GlobalNoticeModel,
    {},
    { order: [['id', 'DESC']] }
  )
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/globalNoticeList
 *  全国播报列表
 */
router.post('/globalNoticeList', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const { filter } = ctx.request.body
  const { title, areaName } = filter || {}
  console.log('areaName', areaName)
  if (title) {
    filter.title = {
      [Op.like]: `%${title}%`,
    }
  }
  if (areaName) {
    filter.areaName = {
      [Op.like]: `%${areaName}%`,
    }
  } else {
    delete filter.areaName
  }
  console.log('filter', filter)
  // 根据id倒序
  const data = await userQuery(
    GlobalNoticeModel,
    { ...filter, userId: id },
    { order: [['id', 'DESC']] }
  )
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/siteGlobalNoticeList
 *  站点获取全国播报列表
 */
 router.post('/siteGlobalNoticeList', async (ctx) => {
  // 根据id倒序
  const data = await userQuery(
    GlobalNoticeModel,
    { order: [['id', 'DESC']] }
  )
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/deleteGlobalNotice
 *  删除播报全国
 */
router.post('/deleteGlobalNotice', async (ctx) => {
  const { id } = ctx.request.body
  const data = await GlobalNoticeModel.destroy({ where: { id } })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/addGlobalNotice
 *  新建全国播报
 */
router.post('/addGlobalNotice', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const request = ctx.request.body
  request.userId = id
  const data = await userCreate(GlobalNoticeModel, request)
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/updateGlobalNotice
 *  修改全国播报
 */
router.post('/updateGlobalNotice', async (ctx) => {
  const changeData = ctx.request.body
  const request = changeData
  const { id } = request
  delete request.id
  await GlobalNoticeModel.update(
    { ...request },
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

/**
 *  POST api/User/detailGlobalNotice
 *  返回全国播报详情
 */
router.post('/detailGlobalNotice', async (ctx) => {
  const { id } = ctx.request.body
  const data = await userQueryOne(GlobalNoticeModel, { id })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/userInfo
 *  返回用户信息
 */
router.post('/getUserInfo', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const info = await userQueryOne(UserModel, { id })
  ctx.status = 200
  ctx.body = {
    success: true,
    info,
  }
})

/**
 *  POST api/User/editUserInfo
 *  修改用户信息
 */
router.post('/editUserInfo', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const { changeData } = ctx.request.body
  console.log('changeData', changeData)
  const info = await UserModel.update(
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
    // info,
  }
})

/**
 * route api/User/register
 *  注册接口
 */
router.post('/register', async (ctx) => {
  console.log('register请求：', ctx.request.body)
  const request = ctx.request.body
  const { userName, phone } = request
  console.log('request', request)
  // 加密密码
  // const hashPassword = bcrypt.hashSync(passWord, 10);
  try {
    // 查询数据库是否已经存在相同的手机号或者用户名
    const repeat = await userQueryOne(UserModel, {
      [Op.or]: [{ userName, phone }],
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
      const res = await userCreate(UserModel, request)
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
 *  api/User/toLogin
 *  登录接口(手机号或者用户名登录)
 */
router.post('/userLogin', async (ctx) => {
  const { userName, passWord } = ctx.request.body
  console.log(userName, passWord)
  const userInfo = await userQueryOne(UserModel, { userName })
  console.log('userInfo', userInfo)
  // 用户名或手机号是否存在
  if (!userInfo) {
    ctx.status = 200
    ctx.body = {
      success: false,
      message: `${'用户'}：${userName}不存在！`,
    }
  } else {
    // 密码是否正确
    const { passWord: dbPass, id } = userInfo
    if (passWord === dbPass) {
      ctx.status = 200
      ctx.body = {
        success: true,
        message: '登录成功！',
        userInfo,
      }
    } else {
      // 密码错误
      ctx.status = 200
      ctx.body = {
        success: false,
        message: '密码错误！',
      }
    }
  }
})

/**
 *  POST api/User/userList
 *  获取所有用户列表
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
