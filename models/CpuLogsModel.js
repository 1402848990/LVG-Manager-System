/**
 *@description cpuLogs表的Model
 */

const db = require('../db');

const CpuLogsModel = db.configureModel('cpuLogs', {
  hid: db.INTEGER, // 主机id
  used: db.FLOAT, // cpu使用率
  ramUsed: db.FLOAT, // RAM使用率
  gpuUsed: db.FLOAT // GPU使用率
});

module.exports = CpuLogsModel;
