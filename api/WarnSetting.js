/**
 * @description 主机预警设置接口
 */

const router = require('koa-router')();
const Sequelize = require('sequelize');
const models = require('../models');
const { WarnOptionsModel } = models;
const {
  userCreate,
  userBulkCreate,
  userQuery,
  userQueryOne,
  userUpdate,
  userBulkUpdate,
  userDelete,
  getClientIP
} = require('../utils');

const Op = Sequelize.Op;

/**
 * @description 主机预警设置接口
 */
router.post('/warnSetting', async ctx => {
  // 取出hid和设置项
  const { hid, setting } = ctx.request.body;
  console.log(hid, setting);

  try {
    // 此主机是否已经设置预警
    const exit = await WarnOptionsModel.count({ where: { hid } });
    console.log('-------exit', exit);
    if (exit > 0) {
      // 如果存在则更新预警设置
      console.log('更新');
      await userUpdate(WarnOptionsModel, { ...setting }, { where: { hid } });
    } else {
      // 如果不存在则创建预警设置
      console.log('创建');
      await userCreate(WarnOptionsModel, { hid, ...setting });
    }
    ctx.status = 200;
    ctx.body = {
      success: true,
      hid
    };
  } catch (e) {
    console.log('设置报错：', e);
    ctx.status = 500;
    ctx.body = {
      success: false
    };
  }
});

module.exports = router.routes();
