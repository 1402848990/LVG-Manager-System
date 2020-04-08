/**
 *@description hosts表的Model
 */

const db = require('../db');

const HostModel = db.defineModel('hosts', {
  uid: db.INTEGER, // 用户id
  hostIp: db.STRING,
  hostName: db.STRING,
  hostIp: db.STRING,
  openAt: db.BIGINT,
  closeAt: db.BIGINT,
  state: db.INTEGER,
  coreNum: db.INTEGER,
  system: db.STRING,
  cDisk: db.INTEGER,
  cDiskUsed: db.FLOAT,
  dDisk: {
    type: db.INTEGER,
    allowNull: true
  },
  netWidth: db.INTEGER,
  ram: db.INTEGER,
  password: db.STRING,
  desc: {
    type: db.STRING,
    allowNull: true
  }
});

module.exports = HostModel;
