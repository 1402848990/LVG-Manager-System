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
  system: db.STRING,
  cDisk: db.INTEGER,
  dDisk: db.INTEGER,
  netWidth: db.INTEGER,
  ram: db.INTEGER,
  password: db.STRING,
  desc: db.STRING
});

module.exports = HostModel;
