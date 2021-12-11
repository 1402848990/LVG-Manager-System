/**
 * category表的Model
 * 数据库备类目表
 */

const db = require('../db')

const CategoryModel = db.configureModel('Category', {
  categoryName: db.STRING, //类目明
})

module.exports = CategoryModel
