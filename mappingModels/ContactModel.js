/**
 * contact表的Model
 * 数据库联系人表
 */

const db = require('../db')

const ContactModel = db.configureModel('contacts', {
  name: db.STRING, //姓名
  sex: db.STRING, // 性别
  ownerLocalId: db.INTEGER, // 负责地id
  ownerLocal: db.STRING, // 负责区域名
  address: {
    // 地址
    type: db.STRING,
    allowNull: true,
  },
  remark: {
    // 备注
    type: db.STRING,
    allowNull: true,
  },
  phone: {
    // 手机号
    type: db.FLOAT,
    allowNull: true,
  },
})

module.exports = ContactModel
