/**
 * 定时数据清理
 */
const models = require('../models');
const Sequelize = require('sequelize');
const { CpuLogsModel, HostModel, NetLogsModel, DiskLogsModel } = models;
const { userQuery, userQueryOne } = require('../utils');
const route = require('koa-route');
const Op = Sequelize.Op;
let res;

// 最大数据量 24H 86400
const maxData = 40000;

// 执行数据清理 --6h
clearData(maxData);
setInterval(clearData, 21600000, maxData);

// 获取所有主机hid
async function getHostIds() {
  const res = await userQuery(HostModel, {});
  const hids = res.map(item => item.dataValues.id);
  return hids || [];
}

// 数据清理方法
async function clearData(maxData) {
  const hids = await getHostIds();
  hids.forEach(async id => {
    // cpulogs总条数
    const total = await CpuLogsModel.count({ where: { hid: id } });
    // netlogs总条数
    const totalNet = await NetLogsModel.count({ where: { hid: id } });
    // disklogs总条数
    const totalDisk = await DiskLogsModel.count({ where: { hid: id } });
    console.log(
      'id:',
      id,
      'total:',
      total,
      '--totalNet',
      totalNet,
      '---totalDisk',
      totalDisk
    );
    // 如果CPU数据超出最大条数
    if (total > maxData) {
      const cha = total - maxData;
      const res = await CpuLogsModel.destroy({
        where: { hid: id },
        limit: cha
      });
      console.log('id', id, '===清理cpu数据:', res);
    }
    // 如果Net数据超出最大条数
    if (totalNet > maxData) {
      const cha = totalNet - maxData;
      const resNet = await NetLogsModel.destroy({
        where: { hid: id },
        limit: cha
      });
      console.log('id', id, '----清理net数据:', resNet);
    }
    // 如果disk超出最大条数
    if (totalDisk > maxData) {
      const cha = totalDisk - maxData;
      const resDisk = await DiskLogsModel.destroy({
        where: { hid: id },
        limit: cha
      });
      console.log('id', id, '----清理disk数据:', resDisk);
    }
  });
}
