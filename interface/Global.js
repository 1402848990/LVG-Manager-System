/**
 * 疫情总览接口
 */
const router = require('koa-router')()
const Sequelize = require('sequelize')
const models = require('../autoScanModels')
const axios = require('axios')
const md5 = require('md5')
const { ContactModel } = models
const { mysqlCreate, userQuery, userQueryOne, userDelete } = require('../utils')

const Op = Sequelize.Op
const now = Date.now()
console.log(
  'sign',
  md5(`appid13463formatjson53ac8bcc1085c2a596858b56ae6997ea`),
  now
)

/**
 *  POST api/Global/globalViewData
 *  获取总览数据
 */
router.post('/globalViewData', async (ctx) => {
  const { date } = ctx.request.body
  const res = await axios.get(
    `http://api.tianapi.com/ncov/index?key=d3399928c10cc557a6dd52949ff510d2&date=${date}`
  )
  console.log('res', res)
  ctx.status = 200
  ctx.body = {
    success: true,
    data: res.data.newslist[0],
  }
})


/**
 *  POST api/Global/cityData
 *  获取城市疫情数据
 */
router.post('/allCityData', async (ctx) => {
  const res = await axios.get(
    `https://rijb.api.storeapi.net/api/94/219?format=json&appid=13463&sign=${md5(
      `appid13463formatjson53ac8bcc1085c2a596858b56ae6997ea`
    )}`
  )
  console.log('res', res)
  ctx.status = 200
  ctx.body = {
    success: true,
    data: res.data.retdata,
  }
})

module.exports = router.routes()
