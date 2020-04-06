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
      console.log('all');
      setInterval(getNowCpu, 2000, ctx);

      /**接收消息*/
      // ctx.websocket.on('message', function(message) {
      //   console.log(message);
      //   // 返回给前端的数据
      //   setInterval(() => {
      //     let data = JSON.stringify({
      //       id: Math.ceil(Math.random() * 1000),
      //       time: Date.now()
      //     });
      //     ctx.websocket.send(data);
      //   }, 5000);
      // });
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
