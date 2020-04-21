/**
 *@description CPU数据写入server
 */
const Koa = require('koa');
const models = require('../models');
const { CpuLogsModel, HostModel } = models;
const moment = require('moment');
const Sequelize = require('sequelize');

const app = new Koa();
const Op = Sequelize.Op;

// 服务启动时间
const now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
console.log(`CPU写入服务启动----${now}`);

setInterval(dataWrite, 2000);

app.listen(8090);

// 写入数据
async function dataWrite() {
  // 数据写入时间
  const nows = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  const used = proRandom();

  try {
    // 拿到所有开机的主机id
    const resList = await HostModel.findAll({
      where: {
        state: {
          [Op.not]: 0
        }
      },
      attributes: ['id']
    });
    const hostIdList = [];
    resList.map(item => {
      hostIdList.push(item.dataValues.id);
    });
    console.log('hostIdList', hostIdList);

    const creates = hostIdList.map(item => {
      return {
        hid: item,
        used: proRandom(), // CPU使用率
        ramUsed: proRandom(), // 内存使用率
        gpuUsed: proRandomGpu(), // gpu使用率
        createdAt: Date.now()
      };
    });

    const res = await CpuLogsModel.bulkCreate(creates);
    console.log(`主机CPU、RAM、GPU数据写入成功----${nows}`);
  } catch (e) {
    console.log('CPU数据写入报错：', e);
  }
}

// 根据不同的概率生成不同范围的随机数
/**
  60%：13-35
  20%：5-13
  15%：35-50
  4%： 50-70
  1%： 70-90
 */
function proRandom() {
  const random = Math.floor(Math.random() * 100);
  if (random < 60) {
    return proNum(13, 35);
  } else if (random >= 60 && random < 80) {
    return proNum(5, 13);
  } else if (random >= 80 && random < 95) {
    return proNum(35, 50);
  } else if (random >= 95 && random < 99) {
    return proNum(50, 70);
  } else {
    return proNum(70, 95);
  }
}
/**
  70%：1-10
  29%：10-20
  1%:  20-30
 */
function proRandomGpu() {
  const random = Math.floor(Math.random() * 100);
  if (random < 80) {
    return proNum(1, 10);
  } else if (random >= 80 && random < 99) {
    return proNum(10, 20);
  } else {
    return proNum(20, 30);
  }
}

// 生成两个范围之间的随机数
function proNum(min, max) {
  return (Math.random() * (max - min + 1) + min).toFixed(2);
}
