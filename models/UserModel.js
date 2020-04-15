/**
 *@description users表的Model
 */

const db = require('../db');

const UserModel = db.configureModel('users', {
  userName: db.STRING,
  passWord: db.STRING,
  remark: db.STRING,
  phone: db.INTEGER
});

module.exports = UserModel;
