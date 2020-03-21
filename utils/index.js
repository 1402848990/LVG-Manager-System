const models = require("../models");
const { UserModel } = models;

// 添加数据
async function userCreate(row) {
  await UserModel.create(row);
}

// 批量添加数据
async function userBulkCreate(rowList) {
  await UserModel.bulkCreate(rowList);
}

// 查询表数据
async function userQuery(filter = {}) {
  const data = {
    where: {
      ...filter
    }
  };
  const res = await UserModel.findAll(data);
  return res;
}

// 查询表单条数据
async function userQueryOne(filter = {}) {
  const data = {
    where: {
      ...filter
    }
  };
  const res = await UserModel.findOne(data);
  return res;
}

// 更新数据
async function userUpdate(data, where) {
  const res = await UserModel.update(data, where);
  return res;
}

// 批量更新数据
async function userBulkUpdate(data, where) {
  const query = await sequelize.query("select * from userdents");
  console.log("query", query);
}

// 删除数据
async function userDelete(where) {
  const res = await UserModel.destroy(where);
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
