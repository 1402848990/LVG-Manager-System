/**
 * @description 消息接口
 */
const models = require('../models');
const { HostModel, OperationLogsModel, WarnLogsModel } = models;
const { userQuery, userQueryOne, userDelete } = require('../utils');
const route = require('koa-route');

module.exports = app => {
  app.ws.use(function(ctx, next) {
    ctx.websocket.send(`BellWS-连接成功! ${Date.now()}`);
    return next(ctx);
  });

  app.ws.use(
    route.all('/bellWs', ctx => {
      console.log('bellWs', ctx.request.url);
      // setInterval(getLogsNum, 2000, ctx);
    })
  );
  // 未读消息条数
  app.ws.use(
    route.get('/bellNumWs/:uid', ctx => {
      getLogsNum(ctx);
      console.log('bellNumWs', ctx.request.url);
      setInterval(getLogsNum, 2000, ctx);
    })
  );
  // 消息详情
  app.ws.use(
    route.get('/getLogsDetail/:uid', ctx => {
      getLogsDetail(ctx);
      console.log('getLogsDetail', ctx.request.url);
      setInterval(getLogsDetail, 2000, ctx);
    })
  );
};

// 用户未读消息
async function getLogsNum(ctx) {
  // 用户id
  const uid = ctx.request.url.split('=')[1];
  // 操作记录未读消息
  const operNum = await OperationLogsModel.count({ where: { uid, status: 0 } });
  // 预警记录未读消息
  const warnNum = await WarnLogsModel.count({ where: { uid, status: 0 } });
  const num = operNum + warnNum;
  // console.log('operNum', operNum, 'warnNum', warnNum);
  ctx.websocket.send(num);
}

// 用户未读消息详情
async function getLogsDetail(ctx) {
  // 用户id
  const uid = ctx.request.url.split('=')[1];
  // 操作记录未读消息
  const operLogs = await userQuery(
    OperationLogsModel,
    { uid },
    { order: [['id', 'DESC']] }
  );
  // 预警记录未读消息
  const warnLogs = await userQuery(
    WarnLogsModel,
    { uid },
    { order: [['id', 'DESC']] }
  );
  const data = {
    operLogs,
    warnLogs
  };
  // console.log('operNum', operNum, 'warnNum', warnNum);
  ctx.websocket.send(JSON.stringify(data));
}

// 预警阅读消息
async function doRead() {
  // 消息id
  const arr = ctx.request.url.split('/');
  arr = arr[arr.length - 1];
  const arr2 = arr[0].split('=');
  await userDelete(WarnLogsModel, { id });
}
