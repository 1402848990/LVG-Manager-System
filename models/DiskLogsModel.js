/**
 *@description diskLogs表的Model
 */

const db = require('../db');

const DiskLogsModel = db.configureModel('diskLogs', {
  hid: db.INTEGER, // 主机id
  read: db.FLOAT, // 读取速率
  write: db.FLOAT // 写入速率
});

module.exports = DiskLogsModel;
