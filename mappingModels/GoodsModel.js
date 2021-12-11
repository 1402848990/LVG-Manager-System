/**
 * Goods表的Model
 * 商品表
 */

const db = require('../db');

const GoodstModel = db.configureModel('Goods', {
  name: db.STRING, //商品名
  categoryName: db.STRING, //类目名
  desc: { // 商品描述
    type: db.STRING,
    allowNull: true
  }, 
  rootPrice: db.FLOAT, //成本价格
  price: db.FLOAT, //价格
  salePrice: { // 优惠后价格
    type: db.FLOAT,
    allowNull: true
  }, 
  stock: db.INTEGER, // 库存
  categoryId: db.INTEGER, // 类目Id
  isDiscount:db.INTEGER, // 是否折扣
  expiresAt:db.STRING, // 到期时间
  stockWarn: {
    type: db.INTEGER,
    allowNull: true
  }, 
  expiresWarn: {
    type: db.INTEGER,
    allowNull: true
  }, 
  salesNum: {
    type: db.INTEGER,
    allowNull: true
  }, 
});

module.exports = GoodstModel;
