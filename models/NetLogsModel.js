/**
 *@description netLogs表的Model
 */

const db = require('../db');

const NetLogsModel = db.defineModel('netLogs', {
  hid: db.INTEGER, // 主机id
  up: db.FLOAT, // 上行速率
  down: db.FLOAT // 下行速率
});

module.exports = NetLogsModel;
