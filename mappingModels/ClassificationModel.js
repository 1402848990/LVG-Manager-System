/**
 *@description classification表的Model
 */

const db = require('../db');

const ClassificationModel = db.configureModel('classification', {
  userName: db.STRING, // 用户名 
  title: db.STRING,
  icon: db.STRING,
  type: db.STRING,
});

module.exports = ClassificationModel;
