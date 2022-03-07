/**
 * message表的Model
 * 数据库通告表
 */

const db = require('../db');

const MessageModel = db.configureModel('message', {
  content: db.STRING, //内容
  userId: db.INTEGER, // 用户id
  status: { // 是否启用
    type: db.INTEGER,
    allowNull: true
  },
  remark: { // 备注
    type: db.STRING,
    allowNull: true
  }
});

module.exports = MessageModel;
