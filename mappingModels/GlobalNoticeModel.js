/**
 * globalNotice表的Model
 */

const db = require('../db')

const GlobalNoticeModel = db.configureModel('globalNotice', {
  userId: db.INTEGER, // 用户id
  title: db.STRING, //标题
  content: db.TEXT, //内容
  level: db.INTEGER, // 乐观等级
})

module.exports = GlobalNoticeModel
