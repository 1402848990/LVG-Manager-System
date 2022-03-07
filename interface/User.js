/**
 *  User 接口(注册，登录、工作播报、备忘录、通讯录等)
 */
const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../autoScanModels')
const { UserModel, MessageModel, NoteModel, CityNoticeModel } = models
const { userCreate, userQuery, userQueryOne, userDelete } = require('../utils')

const Op = Sequelize.Op

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
 *  POST api/User/startMessage
 *  启用通告信息
 */
router.post('/startMessage', async (ctx) => {
  const { id } = ctx.request.body
  await MessageModel.update({ status: 0 },{where:{}})
  await MessageModel.update(
    { status: 1 },
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
 *  POST api/User/cityNoticeList
 *  城市播报列表
 */
router.post('/cityNoticeList', async (ctx) => {
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
    CityNoticeModel,
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
 *  POST api/User/siteCityNoticeList
 *  站点城市播报列表
 */
 router.post('/siteCityNoticeList', async (ctx) => {
  const { filter } = ctx.request.body
  const { areaName } = filter || {}
  console.log('areaName', areaName)
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
    CityNoticeModel,
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
 *  POST api/User/deleteCityNotice
 *  删除播报城市
 */
router.post('/deleteCityNotice', async (ctx) => {
  const { id } = ctx.request.body
  const data = await CityNoticeModel.destroy({ where: { id } })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/addCityNotice
 *  新建城市播报
 */
router.post('/addCityNotice', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const request = ctx.request.body
  request.userId = id
  const data = await userCreate(CityNoticeModel, request)
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/updateCityNotice
 *  修改城市播报
 */
router.post('/updateCityNotice', async (ctx) => {
  const changeData = ctx.request.body
  const request = changeData
  const { id } = request
  delete request.id
  await CityNoticeModel.update(
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
 *  POST api/User/detailCityNotice
 *  返回城市播报详情
 */
router.post('/detailCityNotice', async (ctx) => {
  const { id } = ctx.request.body
  const data = await userQueryOne(CityNoticeModel, { id })
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
