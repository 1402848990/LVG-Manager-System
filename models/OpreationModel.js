/**
 *@description operationLogs表的Model
 */

const db = require('../db');

const OperationModel = db.defineModel('operationLogs', {
  uid: db.INTEGER, // 用户id
  hids: db.STRING, // 受影响的主机id
  log: db.STRING,
  type: db.STRING // 操作类型
});

module.exports = OperationModel;
