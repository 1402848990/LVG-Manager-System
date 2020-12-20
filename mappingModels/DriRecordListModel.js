/**
 *@description cusRecordList表的Model(乘客发布的拼车单)
 */

const db = require('../db');

const CusRecordListModel = db.configureModel('driRecordList', {
  userName: db.STRING, // 真实姓名 
  nickName: db.STRING, // 用户名 
  sex: db.INTEGER,
  phone: db.BIGINT,
  date: db.DOUBLE,
  startLocal: db.STRING,
  endLocal: db.STRING,
  startDim:db.DOUBLE,
  startLon:db.DOUBLE,
  endLon:db.DOUBLE,
  endDim:db.DOUBLE,
  cusNum:db.INTEGER,
  status:db.INTEGER,
  remark:db.STRING,
  price:{
    type:db.FLOAT,
    allowNull:true
  },
  matchCode:{
    type:db.STRING,
    allowNull:true
  },
  carCode:{
    type:db.STRING,
    allowNull:true
  },
  cusNumIn:{
    type:db.cusNumIn,
    allowNull:true
  }
});

module.exports = CusRecordListModel;
