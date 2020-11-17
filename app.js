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
const User = require('./interface/User');
const Driver = require('./interface/Driver');
const Urgent = require('./interface/Urgent');
const Classification = require('./interface/Classification');
const Wish = require('./interface/WishList');
const CusRecord = require('./interface/CusRecordList');
const RechargeRecord = require('./interface/RechargeRecord')

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
router.use('/interface/User', User);
/**
 * 司机接口
 */
router.use('/interface/Driver', Driver);
/**
 * 紧急联系人接口
 */
router.use('/interface/Urgent', Urgent);

/**
 * RechargeRecord接口  充值接口
 */
router.use('/interface/RechargeRecord', RechargeRecord);

/**
 * Classification接口
 */
router.use('/interface/Classification', Classification);

/**
 * Classification接口
 */
router.use('/interface/Wish', Wish);

/**
 * Record接口
 */
router.use('/interface/CusRecord', CusRecord);


router.get('/', async ctx => {
  ctx.body = 'index';
});

app.use(router.routes()).use(router.allowedMethods());

// server 端口号
app.listen('8088');
