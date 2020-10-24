const Koa = require('koa');
// ORM
const Sequelize = require('sequelize');
// 路由
const route = require('koa-route');
const router = require('koa-router')();
// cors
const cors = require('koa2-cors');
// bodyParser
const bodyParser = require('koa-bodyparser');
// 导入接口
const User = require('./api/User');
const Classification = require('./api/Classification');
const Wish = require('./api/WishList');
const Record = require('./api/RecordList');

const app =new Koa();
app.proxy = true;

// 配置跨域
app.use(
  cors({
    origin: () => {
      // 允许跨域的地址
      return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
  })
);

/**
 * User接口
 */
app.use(bodyParser());
router.use('/api/User', User);

/**
 * Classification接口
 */
router.use('/api/Classification', Classification);

/**
 * Classification接口
 */
router.use('/api/Wish', Wish);

/**
 * Record接口
 */
router.use('/api/Record', Record);


router.get('/', async ctx => {
  ctx.body = 'index';
});

app.use(router.routes()).use(router.allowedMethods());

// server 端口号
app.listen('8088');
