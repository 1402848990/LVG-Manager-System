/**
 * @description recordList 接口(账单列表)
 */

const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../autoScanModels')
const { CusRecordListModel, DriRecordListModel } = models
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
 * @description 乘客发布拼车单\司机发布行程，通过origin字段进行区分
 */
router.post('/add', async (ctx) => {
  const recordInfo = ctx.request.body
  recordInfo.status = 0
  console.log('recordInfo', recordInfo)

  try {
    const res = await userCreate(CusRecordListModel, { ...recordInfo })
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
 * @description 乘客发布拼车单\司机发布行程
 */
router.post('/addDriver', async (ctx) => {
  const recordInfo = ctx.request.body
  recordInfo.status = 0
  console.log('recordInfo', recordInfo)

  try {
    const res = await userCreate(DriRecordListModel, { ...recordInfo })
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
  if (request.search === '') {
    delete request.search
  }
  // 如果是获取当月信息
  // if (request.isMonth) {
  //   const [monthStart, monthEnd] = currentMonthBet()
  //   console.log('monthStart', monthStart, 'monthEnd', monthEnd)
  //   request.startDate = monthStart
  //   request.endDate = monthEnd
  //   delete request.isMonth
  // }
  if (request.startLocal) {
    request.startLocal = { [Op.like]: `%${request.startLocal}%` }
  }
  if (request.endLocal) {
    request.endLocal = { [Op.like]: `%${request.endLocal}%` }
  }
  if(request.all){
    if (request.startDate) {
    request.date = {
      [Op.between]: [request.startDate, request.endDate],
    }
    delete request.startDate
    delete request.endDate
    delete request.all
  }
  }
  // 如果有开始时间条件，进行时间段筛选
  if (request.startDate||!request.all) {
    request.startDate>Date.now()?request.date=Date.now():null
    request.date = {
      [Op.between]: [request.startDate, request.endDate],
    }
    delete request.startDate
    delete request.endDate
    delete request.all
  }

  // 如果有搜索条件,进行备注、出发地、目的地的模糊搜索
  if (request.search) {
    request[Op.or] = [
      {
        remark: { [Op.like]: `%${request.search}%` },
      },
      {
        startLocal: { [Op.like]: `%${request.search}%` },
      },
      {
        endLocal: { [Op.like]: `%${request.search}%` },
      },
    ]
    delete request.search
  }
  console.log('request', request)
  try {
    const res = await userQuery(CusRecordListModel, request, {
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

/**
 * @description 获取所有记录（司机）
 */
router.post('/getRecordListDriver', async (ctx) => {
  const request = ctx.request.body
  // }
  if (request.startLocal) {
    request.startLocal = { [Op.like]: `%${request.startLocal}%` }
  }
  if (request.endLocal) {
    request.endLocal = { [Op.like]: `%${request.endLocal}%` }
  }
  // 如果有开始时间条件，进行时间段筛选
  if (request.startDate) {
    request.date = {
      [Op.between]: [request.startDate, request.endDate],
    }
    delete request.startDate
    delete request.endDate
  }
  // 如果有搜索条件,进行备注、出发地、目的地的模糊搜索
  if (request.search) {
    request[Op.or] = [
      {
        remark: { [Op.like]: `%${request.search}%` },
      },
      {
        startLocal: { [Op.like]: `%${request.search}%` },
      },
      {
        endLocal: { [Op.like]: `%${request.search}%` },
      },
    ]
    delete request.search
  }
  console.log('request', request)
  try {
    const res = await userQuery(DriRecordListModel, request, {
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

/**
 * @description 获取待出行、拼车统计数据
 */
router.post('/getRecordData', async (ctx) => {
  const { nickName } = ctx.request.body
  try {
    const waitOrderCount = await CusRecordListModel.count({
      where: { status: 0, nickName },
    })
    const allCount = await CusRecordListModel.count({ nickName })
    console.log('waitOrderCount', waitOrderCount, 'allCount', allCount)
    ctx.status = 200
    ctx.body = {
      success: true,
      data: {
        waitOrderCount,
        allCount,
      },
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
