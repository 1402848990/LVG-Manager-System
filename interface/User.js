/**
 *  User 接口(注册，登录、工作计划、备忘录、通讯录等)
 */
const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../autoScanModels')
const { UserModel, ContactModel,NoteModel,PlanModel } = models
const { userCreate, userQuery, userQueryOne, userDelete } = require('../utils')

const Op = Sequelize.Op

/**
 *  POST api/User/contactList
 *  获取所有联系人列表
 */
router.post('/contactList', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const { filter } = ctx.request.body
  // 根据id倒序
  const data = await userQuery(
    ContactModel,
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
 *  POST api/User/addContact
 *  新建联系人
 */
router.post('/addContact', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const request = ctx.request.body
  request.userId = id
  const data = await userCreate(ContactModel, request)
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
 *  POST api/User/planList
 *  获取所有工作计划列表
 */
router.post('/planList', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const { filter } = ctx.request.body
  // 根据id倒序
  const data = await userQuery(
    PlanModel,
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
 *  POST api/User/deletePlan
 *  删除工作计划
 */
router.post('/deletePlan', async (ctx) => {
  const { id } = ctx.request.body
  const data = await PlanModel.destroy({ where: { id } })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/addPlan
 *  新建工作计划
 */
router.post('/addPlan', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const request = ctx.request.body
  request.userId = id
  const data = await userCreate(PlanModel, request)
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/updatePlan
 *  修改计划
 */
router.post('/updatePlan', async (ctx) => {
  const changeData = ctx.request.body
  const request = changeData
  const {id} = request
  delete request.id
  await PlanModel.update(
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
 *  POST api/User/detailPlan
 *  返回计划详情
 */
router.post('/detailPlan', async (ctx) => {
  const { id } = ctx.request.body
  const data = await userQueryOne(PlanModel, { id })
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
