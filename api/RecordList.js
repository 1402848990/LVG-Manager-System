/**
 * @description recordList 接口(账单列表)
 */

const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../models')
const { RecordListModel } = models
const {
  userCreate,
  userBulkCreate,
  userQuery,
  userQueryOne,
  userUpdate,
  userBulkUpdate,
  userDelete,
  getClientIP,
  currentMonthBet,
} = require('../utils')

const Op = Sequelize.Op

/**
 * @description 新增记录
 */
router.post('/addRecord', async (ctx) => {
  const recordInfo = ctx.request.body

  console.log('recordInfo', recordInfo)

  try {
    const res = await userCreate(RecordListModel, { ...recordInfo })
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
 * @description 获取所有记录
 */
router.post('/getRecordList', async (ctx) => {
  const request = ctx.request.body
  // 如果是获取当月信息
  if (request.isMonth) {
    const [monthStart, monthEnd] = currentMonthBet()
    console.log('monthStart', monthStart, 'monthEnd', monthEnd)
    request.startDate = monthStart
    request.endDate = monthEnd
    delete request.isMonth
  }
  // 如果有开始时间条件
  if (request.startDate) {
    request.date = {
      [Op.between]: [request.startDate, request.endDate],
    }
    delete request.startDate
    delete request.endDate
  }
  // 如果有搜索条件
  if (request.search) {
    request.remark = {
      [Op.like]: `%${request.search}%`,
    }
    delete request.search
  }
  console.log('request', request)
  try {
    const res = await userQuery(RecordListModel, request, {
      order: [['date', 'DESC']],
    })
    // console.log('-----res----', res)
    ctx.status = 200
    ctx.body = {
      success: true,
      data: res,
    }
  } catch (e) {
    console.log('获取记录接口报错：', e)
    ctx.status = 500
    ctx.body = {
      success: false,
    }
  }
})

module.exports = router.routes()
