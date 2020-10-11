/**
 *@description wishList表的Model
 */

const db = require('../db');

const WishListModel = db.configureModel('wishList', {
  userName: db.STRING, // 用户名 
  type: db.INTEGER,
  remark: db.INTEGER,
  date: db.INTEGER,
  price: db.DOUBLE,
  classification: db.INTEGER
});

module.exports = WishListModel;
