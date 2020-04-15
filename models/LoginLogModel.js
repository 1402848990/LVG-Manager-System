/**
 *@description loginLog表的Model
 */

const db = require('../db');

const loginLog = db.configureModel('loginLogs', {
  uid: db.INTEGER, // 用户id
  ip: db.STRING,
  address: db.STRING,
  type: db.STRING // 登录方式 userName|phone
});

module.exports = loginLog;
