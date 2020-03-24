const models = require('../models');
// const { UserModel } = models;

// 添加数据
async function userCreate(model, row) {
  await model.create(row);
}

// 批量添加数据
async function userBulkCreate(model, rowList) {
  await model.bulkCreate(rowList);
}

// 查询表数据
async function userQuery(model, filter = {}) {
  const data = {
    where: {
      ...filter
    }
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

module.exports = {
  userCreate,
  userBulkCreate,
  userQuery,
  userQueryOne,
  userUpdate,
  userBulkUpdate,
  userDelete
};
