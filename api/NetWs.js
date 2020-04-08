const models = require('../models');
const { NetLogsModel, HostModel } = models;
const { userQuery, userQueryOne } = require('../utils');
const route = require('koa-route');

let res;

module.exports = app => {
  app.ws.use(function(ctx, next) {
    ctx.websocket.send(`NETWS-连接成功! ${Date.now()}`);
    return next(ctx);
  });

  app.ws.use(
    route.all('/NetWs', ctx => {
      console.log('all--netws');
      setInterval(getNowCpu, 2000, ctx);
    })
  );
  // 单个主机的网络状况
  app.ws.use(
    route.get('/NetWsOne/:hid', ctx => {
      console.log('one--netws');
      setInterval(getNowNetOne, 2000, ctx);
    })
  );
};

// 获取最新的所有网络数据并send
async function getNowCpu(ctx) {
  // 拿到主机总数
  const total = await HostModel.count({});
  // 拿到所有主机网络实时数据
  res = await NetLogsModel.findAll({
    where: {},
    limit: total,
    order: [['id', 'DESC']]
  });
  const data = JSON.stringify(res);
  ctx.websocket.send(data);
}

// 获取最新的所有网络数据并send
async function getNowNetOne(ctx) {
  // 拿到主机id
  const hid = ctx.request.url.split('=')[1];
  // 拿到网络实时数据
  res = await NetLogsModel.findOne({
    where: { hid },
    order: [['id', 'DESC']]
  });
  // console.log('res', res);

  const { createdAt, up, down } = res;
  const data = [
    {
      time: createdAt,
      speed: up,
      type: '上行'
    },
    {
      time: createdAt,
      speed: down,
      type: '下行'
    }
  ];
  ctx.websocket.send(JSON.stringify(data));
}
