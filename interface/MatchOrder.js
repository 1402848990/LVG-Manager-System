/**
 * @description 匹配订单 接口
 */

const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../autoScanModels')
const { CusRecordListModel, DriRecordListModel,DriverModel } = models
const {
  userCreate,
  userQuery,
  userQueryOne,
} = require('../utils')
const uuid = require('node-uuid')

const Op = Sequelize.Op

/**
 * @description 乘客拼车
 */
router.post('/match', async (ctx) => {
  const { cusNum, orderInfo, userName } = ctx.request.body
  const { id } = orderInfo
  // 生成唯一编码
  const matchCode = uuid.v1()
  // 订单状态， 满员为1  不满员为0
  const status = cusNum + orderInfo.cusNumIn >= orderInfo.cusNum ? 1 : 0
  // 已上座乘客
  const cusNumIn = orderInfo.cusNumIn + cusNum

  orderInfo.userName = userName
  orderInfo.matchCode = matchCode
  orderInfo.status = status
  delete orderInfo.id

  try {
    // 更新司机端的订单状态
    const driRes = await DriRecordListModel.update(
      {
        matchCode,
        status,
        cusNumIn,
      },
      {
        where: {
          id,
        },
      }
    )
    // 为乘客增加一条订单
    const res = await userCreate(CusRecordListModel, { ...orderInfo })
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
 * @description 司机接单
 */
router.post('/matchDri', async (ctx) => {
  const {  orderInfo, userName,nickName } = ctx.request.body
  const { id } = orderInfo
  // 生成唯一编码
  const matchCode = uuid.v1()
  // 订单状态， 满员为1  不满员为0
  const status = 1
  // 已上座乘客
  const cusNumIn = orderInfo.cusNum

   // 获取司机车牌号
   let driInfo = await userQueryOne(DriverModel, { nickName })
   driInfo = driInfo.toJSON()
   console.log('driInfo',driInfo)

   orderInfo.carCode = driInfo.carCode
  orderInfo.userName = userName
  orderInfo.matchCode = matchCode
  orderInfo.status = status
  orderInfo.cusNumIn = cusNumIn
  delete orderInfo.id


  try {
    // 更改乘客订单状态
    const cusRes = await CusRecordListModel.update(
      {
        matchCode,
        status,
      },
      {
        where: {
          id,
        },
      }
    )
    // 为司机创建一条订单
    const res = await userCreate(DriRecordListModel, { ...orderInfo })
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
  recordInfo.cusNumIn = 0
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

  // 如果有开始时间条件，进行时间段筛选
  if (request.startDate) {
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
