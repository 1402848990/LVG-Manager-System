const models = require('../models');
const { CpuLogsModel, HostModel } = models;
const { userQuery, userQueryOne } = require('../utils');
const route = require('koa-route');

let res;

module.exports = app => {
  app.ws.use(function(ctx, next) {
    ctx.websocket.send(`CPUWS-连接成功! ${Date.now()}`);
    return next(ctx);
  });

  app.ws.use(
    route.all('/CpuWs', ctx => {
      console.log('all', ctx.request.url);
      setInterval(getNowCpu, 2000, ctx);
    })
  );
  app.ws.use(
    route.get('/CpuWsOne/:hid', ctx => {
      console.log('one', ctx.request.url);
      setInterval(getNowCpuOne, 2000, ctx);
    })
  );
  // 大屏中cpu监控
  app.ws.use(
    route.get('/cpuScreen/:hid', ctx => {
      console.log('one', ctx.request.url);
      setInterval(cpuScreen, 2000, ctx);
    })
  );
  // 根据主机id获取所有CPU历史记录
  app.ws.use(
    route.get('/CpuWsAll/:hid', ctx => {
      console.log('allsalls', ctx.request.url);
      getNowCpuAll(ctx);
      /**接收消息后*/
      ctx.websocket.on('message', function(message) {
        console.log('前端消息', message);
        // 返回给前端的数据
        let data = JSON.stringify({
          id: Math.ceil(Math.random() * 1000),
          time: Date.now()
        });
        ctx.websocket.send(data);
      });
    })
  );
};

// 获取最新的所有CPU数据并send
async function getNowCpu(ctx) {
  // 拿到主机总数
  const total = await HostModel.count({});
  // 拿到所有主机cpu实时数据
  res = await CpuLogsModel.findAll({
    where: {},
    limit: total,
    order: [['id', 'DESC']]
  });
  const data = JSON.stringify(res);
  ctx.websocket.send(data);
}

// 获取最新的指定主机id的CPU数据并send
async function getNowCpuOne(ctx) {
  const hid = ctx.request.url.split('=')[1];
  // console.log('hid', hid);

  // 拿到所有主机cpu实时数据
  res = await CpuLogsModel.findOne({
    where: { hid },
    order: [['id', 'DESC']]
  });
  const data = JSON.stringify(res);
  ctx.websocket.send(data);
}

// 根据主机id获取所有CPU数据并send
async function getNowCpuAll(ctx) {
  const hid = ctx.request.url.split('=')[1];
  // 拿到指定id主机cpu历史数据
  res = await CpuLogsModel.findAll({
    where: { hid },
    order: [['id', 'DESC']]
  });
  const data = JSON.stringify(res);
  ctx.websocket.send(data);
}

// 大屏CPU监控
async function cpuScreen(ctx) {
  // 拿到主机id
  const hid = ctx.request.url.split('=')[1];
  // 拿到网络实时数据
  res = await CpuLogsModel.findOne({
    where: { hid },
    order: [['id', 'DESC']]
  });
  // console.log('res', res);

  const { createdAt, used, ramUsed, gpuUsed } = res;
  const data = [
    {
      time: createdAt,
      used,
      ramUsed,
      gpuUsed,
      type: 'CPU使用率',
      ramType: 'RAM使用率'
    }
  ];
  ctx.websocket.send(JSON.stringify(data));
}
