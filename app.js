const Koa = require('koa')
// 路由
const route = require('koa-route')
const router = require('koa-router')()
// cors
const cors = require('koa2-cors')
// bodyParser
const bodyParser = require('koa-bodyparser')
// 导入接口
const Concat = require('./interface/Contact')
const Category = require('./interface/Category')
const Goods = require('./interface/Goods')
const Machine = require('./interface/Machine')
const Order = require('./interface/Order')
const Contact = require('./interface/Contact')
const Assest = require('./interface/Assest')

const app = new Koa()
app.proxy = true

// 配置跨域
app.use(
  cors({
    origin: () => {
      // 允许跨域的地址
      return 'http://localhost:4444'
    },
    exposeHeaders: [
      'WWW-Authenticate',
      'Server-Authorization',
      'Cookie',
      'Access-Control-Allow-Origin',
    ],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'post'],
    allowHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Set-Cookie',
      'Access-Control-Allow-Origin',
    ],
  })
)

/**
 * 用户接口
 */
app.use(bodyParser({ multipart: true }))
router.use('/interface/Concat', Concat)

/**
 * 类目接口
 */
router.use('/interface/Category', Category)

/**
 * 商品接口
 */
router.use('/interface/Goods', Goods)

/**
 * 机器接口
 */
router.use('/interface/Machine', Machine)

/**
 * 订单接口
 */
router.use('/interface/Order', Order)

/**
 * 联系人接口
 */
router.use('/interface/Contact', Contact)

/**
 * 资产接口
 */
 router.use('/interface/Assest', Assest)

router.get('/', async (ctx) => {
  ctx.body = 'index'
})

app.use(router.routes()).use(router.allowedMethods())

// server 端口号
app.listen('8088')
