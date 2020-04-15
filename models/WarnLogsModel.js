/**
 *@description warnLogs表的Model
 */

const db = require('../db');

const WarnLogsModel = db.configureModel('warnLogs', {
  uid: db.INTEGER, // 用户id
  hid: db.INTEGER, // 受影响的主机id
  type: db.STRING, // 触发类型
  hostName: db.STRING, // 主机名
  warnValue: db.FLOAT, // 触发值
  settingValue: db.FLOAT // 设置值
});

module.exports = WarnLogsModel;
