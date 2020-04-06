/**
 *@description NET数据写入server
 */
const Koa = require('koa');
const models = require('../models');
const { NetLogsModel, HostModel } = models;
const { userCreate, proNum } = require('../utils');
const moment = require('moment');
const Sequelize = require('sequelize');

const app = new Koa();
const Op = Sequelize.Op;

// 服务启动时间
const now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
console.log(`CPU写入服务启动----${now}`);

// app.use(async (ctx, next) => {
setInterval(dataWrite, 2000);
// });

app.listen(8091);

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
        up: proRandom(),
        down: proRandom(),
        createdAt: Date.now()
      };
    });

    const res = await NetLogsModel.bulkCreate(creates);
    console.log(creates, '----', nows);
  } catch (e) {
    console.log('NET数据写入报错：', e);
  }
}

// 根据不同的概率生成不同范围的随机数
/**
  60%：200-1500
  20%：50-200
  15%：1500-2500
  4%： 2500-3500
  1%： 20-50
 */
function proRandom() {
  const random = Math.floor(Math.random() * 100);
  if (random < 60) {
    return proNum(200, 1500);
  } else if (random >= 60 && random < 80) {
    return proNum(50, 200);
  } else if (random >= 80 && random < 95) {
    return proNum(1500, 2500);
  } else if (random >= 95 && random < 99) {
    return proNum(2500, 3500);
  } else {
    return proNum(20, 50);
  }
}
