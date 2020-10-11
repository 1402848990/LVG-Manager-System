/**
 *@description wishList表的Model
 */

const db = require('../db');

const WishListModel = db.configureModel('wishList', {
  wishName: db.STRING, // 用户名 
  wishLevel: db.INTEGER,
  wishPrice: db.DOUBLE,
});

module.exports = WishListModel;
