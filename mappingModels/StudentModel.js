/**
 * Student表的Model
 */

const db = require('../db');

const StudentModel = db.configureModel('students', {
  name: db.STRING, //真实姓名
  stuId: db.FLOAT, //学号
  userId: db.INTEGER, //学号
  sex: db.STRING, //性别
  level: { // 职务
    type: db.STRING,
    allowNull: true
  }, 
  parentName: { // 父母名字
    type: db.STRING,
    allowNull: true
  }, 
  parentPhone: { // 父母手机号
    type: db.STRING,
    allowNull: true
  }, 
  phone: { // 手机号
    type: db.STRING,
    allowNull: true
  },
  date: { // 生日
    type: db.STRING,
    allowNull: true
  }, 
  garde: { // 年级
    type: db.STRING,
    allowNull: true
  }, 
  address: { // 籍贯
    type: db.STRING,
    allowNull: true
  }, 
});

module.exports = StudentModel;
