const Koa = require('koa');
// 路由
const route = require('koa-route');
const router = require('koa-router')();
const axios = require('axios')
// cors
const cors = require('koa2-cors');
// bodyParser
const bodyParser = require('koa-bodyparser');
// 导入接口
const Global = require('./interface/Global');
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

const sevenData = []
let countTime = 0
for (let i = -6; i < 1; i++) {
  countTime++
  setTimeout(() => {
    const date = getDayString(i)
    console.log(`正在获取 ${date} 数据`)
    axios
      .get(
        `http://api.tianapi.com/ncov/index?key=d3399928c10cc557a6dd52949ff510d2&date=${date}`
      )
      .then((res) => {
        console.log('res', res.data)
        res.data.newslist[0].desc.date = date
        sevenData.push(res.data.newslist[0])
        console.log('目前已经获取：', sevenData.length)
        if (sevenData.length === 7) {
          console.log('近7天数据请求完毕')
          app.context.sevenData = sevenData
        }
      })
  }, countTime*1000)
}

/**
 * 用户接口
 */
app.use(bodyParser());
router.use('/interface/User', User);
/**
 * 学生接口
 */
router.use('/interface/Stu', Student);
/**
 * 全国疫情相关接口
 */
 router.use('/interface/Global', Global);

 /**
 *  POST api/Global/getSevenData
 *  获取近7天数据
 */
router.post('/interface/getSevenData', async (ctx) => {
  ctx.status = 200
  ctx.body = {
    success: true,
    data: app.context.sevenData,
  }
})

router.get('/', async ctx => {
  ctx.body = 'index';
});

app.use(router.routes()).use(router.allowedMethods());

// server 端口号
app.listen('8088');


// 获取距离今天n天的日期，返回string格式
function getDayString(day) {
  const today = new Date()

  const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day

  today.setTime(targetday_milliseconds)

  const tYear = today.getFullYear()

  let tMonth = today.getMonth()

  let tDate = today.getDate()

  tMonth = doHandleMonth(tMonth + 1)

  tDate = doHandleMonth(tDate)

  return `${tYear}-${tMonth}-${tDate}`
}

function doHandleMonth(month) {
  let m = month

  if (month.toString().length == 1) {
    m = `0${month}`
  }

  return m
}
