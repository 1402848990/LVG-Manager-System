/**
 * course表的Model
 * 数据库课程表
 */

const db = require('../db')

const CourseModel = db.configureModel('course', {
  userId: db.INTEGER, // 用户id
  name: db.STRING, //课程名
})

module.exports = CourseModel
