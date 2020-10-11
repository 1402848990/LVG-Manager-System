/**
 *@description classification表的Model
 */

const db = require('../db');

const ClassificationModel = db.configureModel('classification', {
  userName: db.STRING, // 用户名 
  classificationName: db.STRING,
  type: db.STRING,
});

module.exports = ClassificationModel;
