/**
 *@description user表的Model
 */

const db = require('../db');

const UserModel = db.configureModel('users', {
  nickName: db.STRING, // 微信名
  userName: { // 真实姓名
    type: db.STRING,
    allowNull: true
  }, 
  age: { // 年龄
    type: db.INTEGER,
    allowNull: true
  },
  sex: { // 性别
    type: db.INTEGER,
    allowNull: true
  },
  phone: { // 手机号
    type: db.FLOAT,
    allowNull: true
  },
  amount: { // 余额
    type: db.FLOAT,
    allowNull: true
  },
});

module.exports = UserModel;
