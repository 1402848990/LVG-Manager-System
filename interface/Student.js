/**
 *  学生相关接口（成绩、列表、课程等）
 */
const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../autoScanModels')
const { StudentModel, CourseModel, ExamModel } = models
const { userCreate, userQuery, userQueryOne } = require('../utils')

const Op = Sequelize.Op

/**
 *  POST api/Stu/list
 *  获取所有学生列表
 */
router.post('/list', async (ctx) => {
  // 获取前端请求参数
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const { filter } = ctx.request.body
  const { name } = filter || {}
  if (name) {
    filter.name = {
      [Op.like]: `%${name}%`,
    }
  }
  // 从数据库中查询并根据id倒序
  const data = await userQuery(
    StudentModel,
    { ...filter, userId: id },
    { order: [['id', 'DESC']] }
  )
  ctx.status = 200
  // 将数据返回给前端
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/Stu/add
 *  新建学生
 */
router.post('/add', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const request = ctx.request.body
  console.log('request', request)
  request.userId = id
  const data = await userCreate(StudentModel, request)
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/Stu/detail
 *  返回学生详情
 */
router.post('/detail', async (ctx) => {
  const { id } = ctx.request.body
  const data = await userQueryOne(StudentModel, { stuId: id })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/Stu/delete
 *  删除学生
 */
router.post('/delete', async (ctx) => {
  const { id } = ctx.request.body
  const data = await StudentModel.destroy({ where: { id } })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/User/updateMessage
 *  修改学生信息
 */
router.post('/update', async (ctx) => {
  const changeData = ctx.request.body
  const { id } = changeData
  delete changeData.id
  console.log('changeData', changeData)
  await StudentModel.update(
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
 *  POST api/Stu/courseList
 *  获取所有课程列表
 */
router.post('/courseList', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  // 根据id倒序
  const data = await userQuery(
    CourseModel,
    { userId: id }
    // { order: [['id', 'DESC']] }
  )
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/Stu/courseAdd
 *  新增课程
 */
router.post('/courseAdd', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const { name } = ctx.request.body
  const data = await userCreate(CourseModel, { name, userId: id })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/Stu/deleteCourse
 *  删除课程
 */
router.post('/deleteCourse', async (ctx) => {
  const { id } = ctx.request.body
  const data = await CourseModel.destroy({ where: { id } })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

/**
 *  POST api/Stu/examList
 *  获取所有成绩列表
 */
router.post('/examList', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const { filter } = ctx.request.body
  // 根据id倒序
  const data = await userQuery(
    ExamModel,
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
 *  POST api/Stu/examAdd
 *  新增成绩
 */
router.post('/examAdd', async (ctx) => {
  const cookie = decodeURIComponent(ctx.header['set-cookie'])
  const { id } = JSON.parse(cookie)
  const request = ctx.request.body
  console.log('request', request)
  const data = await userCreate(ExamModel, { ...request, userId: id })
  ctx.status = 200
  ctx.body = {
    success: true,
    data,
  }
})

module.exports = router.routes()
