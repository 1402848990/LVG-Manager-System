/**
 *@description urgent表的Model(紧急联系人表)
 */

const db = require('../db');

const UrgentModel = db.configureModel('urgent', {
  nickName: db.STRING, // 微信名
  urgentName: db.STRING, // 紧急联系人姓名
  urgentPhone: db.STRING, // 紧急联系人电话
});

module.exports = UrgentModel;
