const models = require('../models');
// const { UserModel } = models;

// 生成两个范围之间的随机数,精确两位小数
function proNum(min, max) {
  return (Math.random() * (max - min + 1) + min).toFixed(2);
}

// 添加数据
async function userCreate(model, row) {
  await model.create(row);
}

// 批量添加数据
async function userBulkCreate(model, rowList) {
  await model.bulkCreate(rowList);
}

// 查询表数据
async function userQuery(model, filter = {}, extra = {}) {
  const data = {
    where: {
      ...filter
    },
    ...extra
  };
  const res = await model.findAll(data);
  return res;
}

// 查询表单条数据
async function userQueryOne(model, filter = {}, extra = {}) {
  const data = {
    where: {
      ...filter
    },
    ...extra
  };
  console.log(data);
  const res = await model.findOne(data);
  return res;
}

// 更新数据
async function userUpdate(data, where) {
  const res = await model.update(data, where);
  return res;
}

// 批量更新数据
async function userBulkUpdate(data, where) {
  const query = await sequelize.query('select * from userdents');
  console.log('query', query);
}

// 删除数据
async function userDelete(model, where) {
  const res = await model.destroy(where);
}

// 获取IP
function getClientIP(req) {
  return (
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  );
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
  proNum
};
