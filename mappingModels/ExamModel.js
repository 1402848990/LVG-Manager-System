/**
 * exam表的Model
 * 数据库成绩表
 */

const db = require('../db')

const ExamModel = db.configureModel('exam', {
  userId: db.INTEGER, // 用户id
  stuId: db.INTEGER, // 学生id
  stuName: db.STRING, // 学生姓名
  content:db.STRING, // 成绩信息
  date: db.STRING, //学期
  garde: db.STRING, // 班级
  stuSex:db.STRING, // 学生性别
})
module.exports = ExamModel
