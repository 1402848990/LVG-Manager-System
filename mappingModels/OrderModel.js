/**
 * Order表的Model
 * 订单表
 */

const db = require('../db')

const OrderModel = db.configureModel('Order', {
  machineName: db.STRING,
  machineId: db.INTEGER,
  localId: db.INTEGER, // 地点id
  local: db.STRING, // 地点
  amount: db.FLOAT, // 总金额
  goodsNum: db.INTEGER, // 商品数量
  goodName: db.STRING, // 商品名
  rootPrice: db.FLOAT, // 成本价
  salePrice: {
    type: db.FLOAT,
    allowNull: true
  }, // 售价
  isDiscount: db.INTEGER, // 是否促销
  profit: db.FLOAT, // 利润
  categoryId: db.INTEGER, // 类目ID
  categoryName: db.STRING, // 类目名字
  payWay: db.INTEGER, // 支付方式 0：支付宝 1：微信
  expiresAt: db.STRING, // 过期时间
  price: db.FLOAT,
})

module.exports = OrderModel
