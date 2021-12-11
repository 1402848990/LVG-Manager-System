/**
 * Machine表的Model
 * 机器表
 */

const db = require('../db');

const MachineModel = db.configureModel('Machine', {
  name: db.STRING, 
  localId: db.INTEGER, // 地点id
  local: db.STRING, // 地点
  desc: { // 机器描述
    type: db.STRING,
    allowNull: true
  }, 
  target: db.FLOAT, // 目标
  status: db.INTEGER, // 状态
  personName: db.STRING, // 负责人
  personId: db.INTEGER, // 负责人id
  cellNum: db.INTEGER, // 格子数量
  goodIds: db.STRING, // 商品id数组
});

module.exports = MachineModel;
