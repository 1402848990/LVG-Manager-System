/**
 * plan表的Model
 */

const db = require('../db')

const PlanModel = db.configureModel('plan', {
  userId: db.INTEGER, // 用户id
  title: db.STRING, //标题
  content: db.TEXT, //内容
  level: db.INTEGER, // 等级
})

module.exports = PlanModel
