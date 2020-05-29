/**
 * @description 阅读未读消息
 */

const router = require('koa-router')();
const Sequelize = require('sequelize');
const models = require('../models');
const { OperationLogsModel, WarnLogsModel, HostModel } = models;
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
 * @description 删除消息
 */
router.post('/deleteBell', async ctx => {
  const { id, type } = ctx.request.body;
  try {
    // 删除记录
    const res =
      type === 'warn'
        ? await WarnLogsModel.destroy({
            where: {
              id
            }
          })
        : await OperationLogsModel.destroy({
            where: {
              id
            }
          });
    // console.log('删除res', res);
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: res
    };
  } catch (e) {
    console.log('删除记录接口报错：', e);
    ctx.status = 500;
    ctx.body = {
      success: false
    };
  }
});

/**
 * @description 阅读未读消息
 */
router.post('/readBell', async ctx => {
  const { id, type, hid } = ctx.request.body;
  try {
    // 阅读消息
    const res =
      type === 'warn'
        ? await userUpdate(WarnLogsModel, { status: 1 }, { where: { id } })
        : await userUpdate(
            OperationLogsModel,
            { status: 1 },
            { where: { id } }
          );
    // 如果阅读了预警消息要把主机状态变为正常
    if (type === 'warn') {
      await userUpdate(HostModel, { state: 1 }, { where: { id: hid } });
    }
    // console.log('删除res', res);
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: res
    };
  } catch (e) {
    console.log('阅读记录接口报错：', e);
    ctx.status = 500;
    ctx.body = {
      success: false
    };
  }
});

/**
 * @description 阅读全部消息
 */
router.post('/readBellAll', async ctx => {
  const { uid, type } = ctx.request.body;
  try {
    // 区分操作记录和预警记录
    const res =
      type === 'warn'
        ? await userUpdate(
            WarnLogsModel,
            { status: 1 },
            { where: { uid, status: 0 } }
          )
        : await userUpdate(
            OperationLogsModel,
            { status: 1 },
            { where: { uid, status: 0 } }
          );
    // 如果阅读了预警消息要把主机状态变为正常
    if (type === 'warn') {
      await userUpdate(
        HostModel,
        { state: 1 },
        { where: { uid: uid, state: 0 } }
      );
    }
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: res
    };
  } catch (e) {
    console.log('阅读全部记录接口报错：', e);
    ctx.status = 500;
    ctx.body = {
      success: false
    };
  }
});

module.exports = router.routes();
