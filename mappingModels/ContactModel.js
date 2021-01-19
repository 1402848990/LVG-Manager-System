/**
 * contact表的Model
 * 数据库联系人表
 */

const db = require('../db');

const ContactModel = db.configureModel('contact', {
  name: db.STRING, //姓名
  userId: db.INTEGER, // 用户id
  address: { // 地址
    type: db.STRING,
    allowNull: true
  }, 
  remark: { // 备注
    type: db.STRING,
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
  group: { // 分组
    type: db.STRING,
    allowNull: true
  }, 
});

module.exports = ContactModel;
