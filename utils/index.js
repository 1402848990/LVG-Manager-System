const models = require('../autoScanModels')

// 生成两个范围之间的随机数,精确两位小数
function proNum(min, max) {
  return (Math.random() * (max - min + 1) + min).toFixed(2)
}

// 添加数据
async function userCreate(model, row) {
  await model.create(row)
}

// 批量添加数据
async function userBulkCreate(model, rowList) {
  await model.bulkCreate(rowList)
}

// 查询表数据
async function userQuery(model, filter = {}, extra = {}) {
  const data = {
    where: {
      ...filter,
    },
    ...extra,
  }
  const res = await model.findAll(data)
  return res
}

// 查询表单条数据
async function userQueryOne(model, filter = {}, extra = {}) {
  const data = {
    where: {
      ...filter,
    },
    ...extra,
  }
  console.log(data)
  const res = await model.findOne(data)
  return res
}

// 更新数据
async function userUpdate(model, data, where) {
  const res = await model.update(data, where)
  return res
}

// 批量更新数据
async function userBulkUpdate(data, where) {
  const query = await sequelize.query('select * from userdents')
  console.log('query', query)
}

// 删除数据
async function userDelete(model, where) {
  const res = await model.destroy(where)
}

// 获取IP
function getClientIP(req) {
  return (
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  )
}

// 获取当前月的起始时间
function currentMonthBet() {
  let date = new Date()
  let year = date.getFullYear()
  let year2 = 0
  let month = date.getMonth() + 1
  // 本月第一天日期
  let begin = new Date(year + '-' + month + '-01 00:00:00').getTime()
  // 本月最后一天日期
  let month2 = 0
  if (month + 2 > 12) {
    month2 = 1
    year2 = year + 1
  } else {
    month2 = month + 1
    year2 = year
  }
  // let year2 = month2 == 1 ? year + 1 : year;
  let end = new Date(year2 + '-' + month2 + '-01 00:00:00').getTime() - 1000
  return [begin, end]
}

module.exports = {
  userCreate,
  userBulkCreate,
  userQuery,
  userQueryOne,
  userUpdate,
  userBulkUpdate,
  userDelete,
  getClientIP,
  proNum,
  currentMonthBet,
}
