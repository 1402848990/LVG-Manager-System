/**
 *@description driver表的Model
 */

const db = require('../db')

const DriverModel = db.configureModel('drivers', {
  nickName: db.STRING, // 微信名
  userName: {
    // 真实姓名
    type: db.STRING,
    allowNull: true,
  },
  age: {
    // 年龄
    type: db.INTEGER,
    allowNull: true,
  },
  sex: {
    // 性别
    type: db.INTEGER,
    allowNull: true,
  },
  phone: {
    // 手机号
    type: db.FLOAT,
    allowNull: true,
  },
  amount: {
    // 余额
    type: db.FLOAT,
    allowNull: true,
  },
  carCode: {
    // 车牌
    type: db.STRING,
    allowNull: true,
  },
})

module.exports = DriverModel
