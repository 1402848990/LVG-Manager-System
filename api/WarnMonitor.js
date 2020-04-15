/**
 * @description 预警监控
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

setInterval(scan, 60000);
// scan();

// 扫描数据库数据，是否有达到预警触发值并且开启预警
async function scan() {
  const optres = await userQuery(
    WarnOptionsModel,
    {},
    { attributes: ['hid', 'cpuUsed', 'ramUsed', 'cDiskUsed', 'netWidthUsed'] }
  );

  // 预警设置对象
  const warnObj = {};
  // 设置预警的主机hids
  const hids = [];
  optres.forEach(item => {
    warnObj[item.dataValues.hid] = item.dataValues;
    hids.push(item.hid);
  });
  console.log('warnObj', warnObj);

  // 根据hids取出主机实例的带宽
  const netWidthObj = {};
  const hostres = await userQuery(
    HostModel,
    {
      id: {
        [Op.in]: hids
      }
    },
    {
      attributes: ['id', 'uid', 'netWidth', 'hostName']
    }
  );
  hostres.forEach(item => {
    netWidthObj[item.dataValues.id] = item.dataValues;
  });
  console.log('netWidthObj', netWidthObj);

  // 取相应的最新的cpu、ram数据
  const crres = await CpuLogsModel.findAll({
    where: { hid: { [Op.in]: hids } },
    order: [['id', 'DESC']],
    limit: hids.length
  });

  // 取相应的最新的网络数据
  const netres = await NetLogsModel.findAll({
    where: { hid: { [Op.in]: hids } },
    order: [['id', 'DESC']],
    limit: hids.length
  });

  // CPU\RAM是否触发预警验证
  crres.forEach(item => {
    // 取出当前数据
    const { used: currCpuUsed, ramUsed: currRamUsed, hid } = item.dataValues;
    // cpu对比
    currCpuUsed > warnObj[hid].cpuUsed
      ? warnDo(
          'CPU预警',
          hid,
          netWidthObj[hid].uid,
          netWidthObj[hid].hostName,
          currCpuUsed,
          warnObj[hid].cpuUsed
        )
      : null;
    // ram对比
    currRamUsed > warnObj[hid].ramUsed
      ? warnDo(
          'RAM预警',
          hid,
          netWidthObj[hid].uid,
          netWidthObj[hid].hostName,
          currRamUsed,
          warnObj[hid].ramUsed
        )
      : null;
  });

  // 带宽是否触发预警验证
  netres.forEach(item => {
    // 当前上行网速
    const { up, hid } = item.dataValues;
    // 预警触发临界值
    const shouldWarnValue =
      (netWidthObj[hid].netWidth / 8) * 1024 * warnObj[hid].netWidthUsed * 0.01;
    // 预警对比
    up > shouldWarnValue
      ? warnDo(
          '网络占用率预警',
          hid,
          netWidthObj[hid].uid,
          netWidthObj[hid].hostName,
          up,
          warnObj[hid].cpuUsed
        )
      : null;
  });
}

/**
 * @description 预警处理方法
 * @param {*} type
 * @param {*} hid
 * @param {*} uid
 * @param {*} hostName
 * @param {*} warnValue
 * @param {*} settingValue
 */
async function warnDo(type, hid, uid, hostName, warnValue, settingValue) {
  console.log(
    '----------有预警触发---------',
    type,
    hid,
    uid,
    warnValue,
    settingValue
  );

  // 主机状态改为预警
  HostModel.update({ state: -1 }, { where: { id: hid } });

  // 根据uid拿到用户信息
  const userInfo = await userQueryOne(UserModel, { id: uid });
  const { phone, userName } = userInfo.dataValues;
  console.log(phone, userName);

  sendSMS(phone, hid, hostName, type, settingValue, warnValue, 'warn');

  // 写入预警日志
  const info = {
    type,
    hid,
    uid,
    hostName,
    warnValue,
    settingValue
  };
  warnLogsSave(info);
}

/**
 * @description 写入预警日志
 * @param {*} info
 */
function warnLogsSave(info) {
  try {
    userCreate(WarnLogsModel, {
      ...info
    });
    console.log('预警日志写入成功');
  } catch (e) {
    console.log('写入预警日志报错：', e);
  }
}
