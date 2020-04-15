/**
 * @description 数据清理
 */
const Sequelize = require('sequelize');
const models = require('../models');
const {
  WarnOptionsModel,
  CpuLogsModel,
  NetLogsModel,
  HostModel,
  WarnLogsModel,
  UserModel
} = models;
const {
  userCreate,
  userBulkCreate,
  userQuery,
  userQueryOne,
  userUpdate,
  userBulkUpdate,
  userDelete,
  getClientIP,
  sendSMS
} = require('../utils');
const Op = Sequelize.Op;
