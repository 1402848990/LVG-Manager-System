/**
 *@description sms_codeSendLog表的Model
 */

const db = require('../db');

const Sms_codeSendLogModel = db.configureModel('sms_codeSendLog', {
  phone: db.INTEGER,
  code: db.INTEGER
});

module.exports = Sms_codeSendLogModel;
