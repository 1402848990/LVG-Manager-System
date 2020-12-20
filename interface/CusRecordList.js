/**
 * @description recordList 接口(账单列表)
 */

const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../autoScanModels')
const {
  CusRecordListModel,
  DriRecordListModel,
  UserModel,
  DriverModel,
  RechargeRecordModel,
  DriRechargeRecordModel
} = models
const {
  userCreate,
  userQuery,
  userQueryOne,
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
  const seat = request.seat
  delete request.seat
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
    let res = await userQuery(CusRecordListModel, request, {
      order: [['date', 'DESC']],
    })
    if (seat) {
      const resJson = JSON.parse(JSON.stringify(res))
      res = resJson.filter((item) => item.cusNum - item.cusNumIn >= seat)
    }
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
  const seat = request.seat
  delete request.seat
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
    let res = await userQuery(DriRecordListModel, request, {
      order: [['date', 'DESC']],
    })
    if (seat) {
      const resJson = JSON.parse(JSON.stringify(res))
      res = resJson.filter((item) => item.cusNum - item.cusNumIn === seat)
    }
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
 * @description 获取订单详情（司机）
 */
router.post('/getRecordDetailDriver', async (ctx) => {
  const { matchCode } = ctx.request.body
  try {
    const res = await userQueryOne(DriRecordListModel, { matchCode })

    ctx.status = 200
    ctx.body = {
      success: true,
      info: res,
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
 * @description 完成订单
 */
router.post('/updateCusRecord', async (ctx) => {
  const {
    id,
    status,
    matchCode,
    userNickName,
    nickName,
    driNickName,
    price,
  } = ctx.request.body
  const userPayObj = {}
  const driPayObj = {}

  try {
    const res = await CusRecordListModel.update(
      {
        status,
      },
      { where: { id } }
    )
    const resDri = await DriRecordListModel.update(
      {
        status,
      },
      { where: { matchCode } }
    )

    /**
     * 过账流程
     * 1.用户余额、司机余额进行相应变更
     * 2.充值记录表给双方增加支出与充值记录
     */
    if (status === 3) {
      let userInfo = await userQueryOne(UserModel, { nickName })
      let driInfo = await userQueryOne(DriverModel, { nickName: driNickName })
      userInfo = userInfo.toJSON()
      driInfo = driInfo.toJSON()
      const userNewAmount = userInfo.amount - price
      const driNewAmount = driInfo.amount + price
      await UserModel.update(
        {
          amount: userNewAmount,
        },
        { where: { nickName: nickName } }
      )
      await DriverModel.update(
        {
          amount: driNewAmount,
        },
        { where: { nickName: driNickName } }
      )
      await userCreate(RechargeRecordModel,{nickName:nickName,money:price,type:0})
      await userCreate(DriRechargeRecordModel,{nickName:driNickName,money:price,type:1})
    }

    ctx.status = 200
    ctx.body = {
      success: true,
      info: 'ok',
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
