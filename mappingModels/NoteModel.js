/**
 * note表的Model
 * 数据库备忘录表
 */

const db = require('../db')

const NoteModel = db.configureModel('note', {
  userId: db.INTEGER, // 用户id
  title: db.STRING, //标题
  content: db.STRING, //内容
})

module.exports = NoteModel
