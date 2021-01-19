/**
 * user表的Model
 */

const db = require('../db');

const UserModel = db.configureModel('users', {
  reallyName: db.STRING, //真实姓名
  userName: { // 昵称
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
  email: { // 邮箱
    type: db.STRING,
    allowNull: true
  }, 
  passWord: { // 密码
    type: db.STRING,
    allowNull: true
  }, 
  garde: { // 年级
    type: db.STRING,
    allowNull: true
  }, 
});

module.exports = UserModel;
