/**
 * Asset表的Model
 * 数据库资产表
 */

const db = require('../db')

const AssetModel = db.configureModel('Asset', {
  amount: db.FLOAT, // 金额
  payWay: db.INTEGER, // 支付方式
  orderId: db.INTEGER, // 订单id
})

module.exports = AssetModel
