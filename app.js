const Koa = require('koa');
// 路由
const route = require('koa-route');
const router = require('koa-router')();
// cors
const cors = require('koa2-cors');
// bodyParser
const bodyParser = require('koa-bodyparser');
// 导入接口
const User = require('./interface/User');
const Student = require('./interface/Student');

const app =new Koa();
app.proxy = true;

// 配置跨域
app.use(
  cors({
    origin: () => {
      // 允许跨域的地址
      return 'http://localhost:3000';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization','Cookie','Access-Control-Allow-Origin'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE','post'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept','Set-Cookie','Access-Control-Allow-Origin']
  })
);

/**
 * 用户接口
 */
app.use(bodyParser());
router.use('/interface/User', User);
/**
 * 学生接口
 */
router.use('/interface/Stu', Student);

router.get('/', async ctx => {
  ctx.body = 'index';
});

app.use(router.routes()).use(router.allowedMethods());

// server 端口号
app.listen('8088');
