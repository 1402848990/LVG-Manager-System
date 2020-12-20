/**
 * 定时任务
 */
const models = require('../autoScanModels')
const Sequelize = require('sequelize')
const { CusRecordListModel, DriRecordListModel } = models
const { userQuery, userQueryOne } = require('../utils')
const Op = Sequelize.Op

// 目前的时间
const now = Date.now()
const changeData = {
  status: -1,
}


// 执行订单状态变更
updateOrderStatus()
setInterval(updateOrderStatus,30000)

// 订单状态为 0（待接单）&& 出行日期<=当前日期  && !matchCode
// 更新司机与乘客订单状态
async function updateOrderStatus() {
  const res = await CusRecordListModel.update(
    { ...changeData },
    {
      where: {
        status: 0,
        date: {
          [Op.lte]: now,
        },
        matchCode:{
          [Op.or]:['',null]
        }
      },
    }
  )
  console.log('乘客订单状态更新',res)
  const resDri = await DriRecordListModel.update(
    { ...changeData },
    {
      where: {
        status: 0,
        date: {
          [Op.lte]: now,
        },
        matchCode:{
          [Op.or]:['',null]
        }
      },
    }
  )
  console.log('司机订单状态更新',resDri)
}
