const Koa = require('koa');
// websocket
const websockify = require('koa-websocket');
// ORM
const Sequelize = require('sequelize');
// 路由
const route = require('koa-route');
const router = require('koa-router')();
// cors
const cors = require('koa2-cors');
// bodyParser
const bodyParser = require('koa-bodyparser');
const koajwt = require('koa-jwt');
const key = require('./config/key');
// 接口
const User = require('./api/User');
const Sms = require('./api/SMS');
const Host = require('./api/Host');
const WarnSetting = require('./api/WarnSetting');
const Logs = require('./api/Logs');
const CpuWs = require('./api/CpuWs');
const Bell = require('./api/Bell');

const fs = require('fs');
const axios = require('axios');

const app = websockify(new Koa());
app.proxy = true;

// 配置跨域
app.use(
  cors({
    origin: () => {
      // 允许跨域的地址
      return 'http://localhost:3000';
      // return 'http://wrdemo.cn:80';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
  })
);

// 全局token验证
// require("./config/passport")(passport);
// app.use(async (ctx, next) => {
//   console.log(3);
//   require('./config/tokenCheck')(ctx);
//   await next();
// });

// 验证有没有token
app.use((ctx, next) => {
  return next().catch(err => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = '没有权限！请登录\n';
    } else {
      throw err;
    }
  });
});

// 验证token是否有效
app.use(async (ctx, next) => {
  require('./config/tokenCheck')(ctx);
  await next();
});

app.use(
  koajwt({
    secret: key.loginKey
  }).unless({
    path: [
      /^\/api\/User\/login/,
      /^\/api\/User\/register/,
      /^\/api\/Sms/,
      /^\/upload/
    ]
  })
);

/**
 * User接口
 */
app.use(bodyParser());
router.use('/api/User', User);

/**
 * SMS接口
 */
router.use('/api/Sms', Sms);

/**
 * Host接口
 */
router.use('/api/Host', Host);

/**
 * 预警接口
 */
router.use('/api/WarnSetting', WarnSetting);

/**
 * 日志接口
 */
router.use('/api/Logs', Logs);

/**
 * 消息处理接口
 */
router.use('/api/Bell', Bell);

/**
 *  WS接口
 */
app.use(async (ctx, next) => {
  require('./api/BellWs')(app);
  require('./api/CpuWs')(app);
  require('./api/NetWs')(app);
  await next();
});

/**
 * 预警监控
 */
require('./api/WarnMonitor');

/**
 * 旧数据清理
 */
require('./api/DataClear');

// require('./api/getGps');
// getGps();

router.get('/', async ctx => {
  ctx.body = 'index';
});

app.use(router.routes()).use(router.allowedMethods());

// server 端口号
app.listen('8088');
