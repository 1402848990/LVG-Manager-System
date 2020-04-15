/**
 *@description Disk数据写入server
 */
const Koa = require('koa');
const models = require('../models');
const { DiskLogsModel, HostModel } = models;
const { userCreate, proNum } = require('../utils');
const moment = require('moment');
const Sequelize = require('sequelize');

const app = new Koa();
const Op = Sequelize.Op;

// 服务启动时间
const now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
console.log(`CPU写入服务启动----${now}`);

// app.use(async (ctx, next) => {
setInterval(dataWrite, 10000);
// });

app.listen(8092);

// 写入数据
async function dataWrite() {
  // 数据写入时间
  const nows = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

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
    // console.log('resList', resList);
    const hostIdList = [];
    resList.map(item => {
      hostIdList.push(item.dataValues.id);
    });
    // console.log('hostIdList', hostIdList);

    const creates = hostIdList.map(item => {
      return {
        hid: item,
        read: proRandom(),
        write: proRandom(),
        createdAt: Date.now()
      };
    });

    const res = await DiskLogsModel.bulkCreate(creates);
    console.log(creates, '----', nows);
  } catch (e) {
    console.log('Disk数据写入报错：', e);
  }
}

// 根据不同的概率生成不同范围的随机数
/**
  80%：200-500
  10%：500-2000
  8%：2000-2500
  1%： 2500-3000
 */
function proRandom() {
  const random = Math.floor(Math.random() * 100);
  if (random < 80) {
    return proNum(200, 500);
  } else if (random >= 80 && random < 90) {
    return proNum(500, 2000);
  } else if (random >= 90 && random < 98) {
    return proNum(2000, 2500);
  } else {
    return proNum(2500, 3000);
  }
}
