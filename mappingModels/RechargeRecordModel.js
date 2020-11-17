/**
 *@description rechargeRecord表的Model
 */

const db = require('../db');

const RechargeRecordModel = db.configureModel('rechargeRecord', {
  nickName: db.STRING, // 用户名 
  money: db.FLOAT, // 充值或者花费金额
  type:db.INTEGER // 1 充值  2花费
});

module.exports = RechargeRecordModel;
