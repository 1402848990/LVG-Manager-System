/**
 *@description users表的Model
 */

const db = require('../db');

const UserModel = db.configureModel('users', {
  userName: db.STRING, // 用户名 
  age: { // 年龄
    type: db.INTEGER,
    allowNull: true
  },
  sex: { // 性别
    type: db.INTEGER,
    allowNull: true
  },
  monthMoney: { // 本月预算
    type: db.INTEGER,
    allowNull: true
  },
});

module.exports = UserModel;
