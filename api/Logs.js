/**
 * @description 日志相关接口
 */

const router = require('koa-router')();
const Sequelize = require('sequelize');
const models = require('../models');
const { HostModel, OperationLogsModel } = models;
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
 * @description 写入操作日志接口
 */
router.post('/saveOperationLogs', async ctx => {
  // 获取操作类型、受影响的主机id、用户id
  const { info } = ctx.request.body;

  try {
    const res = await userCreate(OperationLogsModel, {
      ...info
    });
    // console.log('info', info);
    ctx.status = 200;
    ctx.body = {
      success: true
    };
  } catch (e) {
    console.log('写入操作日志接口报错：', e);
    ctx.status = 500;
    ctx.body = {
      success: false
    };
  }
});

/**
 * @description 获取全部操作日志接口
 */
router.post('/getOperationLogs', async ctx => {
  // 获取操作类型、受影响的主机id、用户id
  const { uid } = ctx.request.body;

  try {
    const res = await userQuery(
      OperationLogsModel,
      {
        uid
      },
      {
        order: [['id', 'DESC']]
      }
    );

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: res
    };
  } catch (e) {
    console.log('获取操作日志接口报错：', e);
    ctx.status = 500;
    ctx.body = {
      success: false
    };
  }
});

module.exports = router.routes();
