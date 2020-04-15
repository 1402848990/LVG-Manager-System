/**
 *@description gpuLogs表的Model
 */

const db = require('../db');

const GpuLogsModel = db.configureModel('gpuLogs', {
  hid: db.INTEGER, // 主机id
  used: db.FLOAT // gpu使用率
});

module.exports = GpuLogsModel;
