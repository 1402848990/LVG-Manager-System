/**
 * CityNotice表的Model
 */

const db = require('../db')

const CityNoticeModel = db.configureModel('cityNotice', {
  userId: db.INTEGER, // 用户id
  title: db.STRING, //标题
  content: db.TEXT, //内容
  level: db.INTEGER, // 乐观等级
  areaName: db.STRING, //地区名字
})

module.exports = CityNoticeModel
