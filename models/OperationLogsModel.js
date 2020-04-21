/**
 *@description operationLogs表的Model
 */

const db = require('../db');

const OperationModel = db.configureModel('operationLogs', {
  uid: db.INTEGER, // 用户id
  hids: db.STRING, // 受影响的主机id
  log: {
    type: db.STRING,
    allowNull: true
  },
  type: db.STRING, // 操作类型
  status: {
    type: db.INTEGER,
    allowNull: true
  } // 是否已读
});

module.exports = OperationModel;
