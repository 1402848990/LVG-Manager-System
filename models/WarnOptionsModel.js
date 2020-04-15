/**
 *@description warnOptions表的Model
 */

const db = require('../db');

const WarnOptionsModel = db.configureModel('warnOptions', {
  hid: db.INTEGER, // 主机id
  cpuUsed: db.FLOAT, // cpu使用率
  ramUsed: db.FLOAT, // RAM使用率
  cDiskUsed: db.FLOAT, // C盘容量使用率
  netWidthUsed: db.FLOAT // 带宽使用率
});

module.exports = WarnOptionsModel;
