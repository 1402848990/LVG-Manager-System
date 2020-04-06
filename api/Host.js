/**
 * @description Host 接口(返回主机信息接口)
 */

const router = require('koa-router')();
const Sequelize = require('sequelize');
const models = require('../models');
const { HostModel, CpuLogsModel } = models;
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
 * @description 创建主机接口
 */
router.post('/createHost', async ctx => {
  const { hostInfo } = ctx.request.body;
  hostInfo.state = 1;
  hostInfo.openAt = Date.now();
  hostInfo.closeAt = 0;
  hostInfo.password = 123456;
  console.log(hostInfo);

  try {
    const res = await userCreate(HostModel, { ...hostInfo });
    // console.log('-------res', res);

    ctx.status = 200;
    ctx.body = {
      success: true
    };
  } catch (e) {
    console.log('创建host报错：', e);
    ctx.status = 500;
    ctx.body = {
      success: false
    };
  }
});

/**
 * @description 获取所有主机接口
 */
router.post('/getAllHost', async ctx => {
  const { uid } = ctx.request.body;

  try {
    const res = await userQuery(
      HostModel,
      {
        uid
      },
      {
        order: [['id', 'DESC']]
      }
    );
    // console.log('res', res);
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: res
    };
  } catch (e) {
    console.log('获取所有主机接口报错：', e);
    ctx.status = 500;
    ctx.body = {
      success: false
    };
  }
});

/**
 * @description 批量删除主机接口
 */
router.post('/deleteHostBatch', async ctx => {
  const { ids } = ctx.request.body;

  try {
    const res = await HostModel.destroy({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    });
    // console.log('删除res', res);
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: res
    };
  } catch (e) {
    console.log('批量删除主机接口报错：', e);
    ctx.status = 500;
    ctx.body = {
      success: false
    };
  }
});

/**
 * @description 批量开机接口
 */
router.post('/openHostBatch', async ctx => {
  const { ids } = ctx.request.body;
  const now = Date.now();
  try {
    const res = await HostModel.update(
      { state: 1, openAt: now },
      {
        where: {
          id: {
            [Op.in]: ids
          }
        }
      }
    );
    // console.log('批量关机res', res);
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: res
    };
  } catch (e) {
    console.log('批量开机接口报错：', e);
    ctx.status = 500;
    ctx.body = {
      success: false
    };
  }
});

/**
 * @description 批量关机接口
 */
router.post('/closeHostBatch', async ctx => {
  const { ids } = ctx.request.body;
  const now = Date.now();
  try {
    const res = await HostModel.update(
      { state: 0, closeAt: now },
      {
        where: {
          id: {
            [Op.in]: ids
          }
        }
      }
    );
    // console.log('批量关机res', res);
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: res
    };
  } catch (e) {
    console.log('批量关机接口报错：', e);
    ctx.status = 500;
    ctx.body = {
      success: false
    };
  }
});
module.exports = router.routes();
