/**
 *@description wishList表的Model
 */

const db = require('../db');

const WishListModel = db.configureModel('wishList', {
  userName: db.STRING, // 用户名 
  title: db.INTEGER,
  wishPrice: db.FLOAT,
  wishLevel:db.INTEGER,
  status:db.INTEGER
});

module.exports = WishListModel;
