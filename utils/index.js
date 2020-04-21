const models = require('../models');
const Core = require('@alicloud/pop-core');
// const { UserModel } = models;

async function sendSMS(phone, hid, hostName, type, setValue, warnValue, way) {
  const sendType = type.includes('CPU')
    ? `CPU${setValue}_used${warnValue}`
    : type.includes('RAM')
    ? `RAM${setValue}_used${warnValue}`
    : `NET${setValue}_${Math.floor(warnValue)}`;
  // sms模板code
  const templateCodeList = {
    register: 'SMS_186576385',
    login: 'SMS_186596465',
    warn: 'SMS_187752216'
  };

  // 客户签名
  const client = new Core({
    accessKeyId: 'LTAI4FcLucjk1h8HZcaFBSRQ',
    accessKeySecret: 'yX2uCOUdIsESuTFfdz1Wx9oxfuGrvG',
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
  });

  // sms模板参数
  const params = {
    RegionId: 'cn-hangzhou',
    PhoneNumbers: phone,
    SignName: '大规模虚拟集群管理系统',
    TemplateCode: templateCodeList[way],
    TemplateParam: JSON.stringify({
      code: `id${hid}_${sendType}`
    })
  };
  console.log('params', params);

  const requestOption = {
    method: 'POST'
  };
  // 短信发送
  const result = await client.request('SendSms', params, requestOption);
  console.log('预警短信发送-----', result);
}

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
async function userUpdate(model, data, where) {
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
  proNum,
  sendSMS
};
