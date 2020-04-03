const Koa = require('koa');
// const app = new Koa();
// websocket
const websockify = require('koa-websocket');
// ORM
const Sequelize = require('sequelize');
// 路由
const route = require('koa-route');
const router = require('koa-router')();
// cors
const cors = require('koa2-cors');
const httpproxy = require('koa-better-http-proxy');
// bodyParser
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');
const koajwt = require('koa-jwt');
const key = require('./config/key');
const moment = require('moment');
// 接口
const User = require('./api/User');
const Sms = require('./api/SMS');
const Host = require('./api/Host');

const app = websockify(new Koa());
app.ws.use(function(ctx, next) {
  ctx.websocket.send(`ws-连接成功! ${Date.now()}`);
  return next(ctx);
});

// ws
app.ws.use(
  route.all('/wstest', function(ctx) {
    console.log('all');
    setInterval(() => {
      let data = JSON.stringify({
        id: Math.ceil(Math.random() * 1000),
        time: Date.now()
        // msg: '888'
      });
      ctx.websocket.send(data);
    }, 2000);
    /**接收消息*/
    ctx.websocket.on('message', function(message) {
      console.log(message);
      // 返回给前端的数据
      setInterval(() => {
        let data = JSON.stringify({
          id: Math.ceil(Math.random() * 1000),
          time: Date.now()
        });
        ctx.websocket.send(data);
      }, 5000);
    });
  })
);

// 配置跨域
app.use(
  cors({
    origin: () => {
      // 允许跨域的地址
      return 'http://localhost:3000';
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
    path: [/^\/api\/User\/login/, /^\/api\/User\/register/, /^\/api\/Sms/]
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

router.get('/', async ctx => {
  ctx.body = 'index';
});

// app.use(passport.initialize());
// app.use(passport.session());
app.use(router.routes()).use(router.allowedMethods());

// server 端口号
app.listen('8088');

// 格式化model时间
function formatModelTime(data) {
  for (let item of data) {
    item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss');
    item.updatedAt = moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss');
  }
  return data;
}
