/**
 *@description recordList表的Model
 */

const db = require('../db');

const RecordListModel = db.configureModel('recordList', {
  userName: db.STRING, // 用户名 
  type: db.INTEGER,
  remark: db.INTEGER,
  date: db.BIGINT,
  price: db.DOUBLE,
  classification: db.INTEGER,
  selectedType:db.STRING,
});

module.exports = RecordListModel;
