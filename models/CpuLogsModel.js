/**
 *@description hosts表的Model
 */

const db = require('../db');

const CpuLogsModel = db.defineModel('cpuLogs', {
  hid: db.INTEGER, // 主机id
  used: db.FLOAT // cpu使用率
});

module.exports = CpuLogsModel;
