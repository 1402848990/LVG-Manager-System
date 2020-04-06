const router = require('koa-router')();
const Core = require('@alicloud/pop-core');
const models = require('../models');
const { Sms_codeSendLogModel } = models;
const {
  userCreate,
  userBulkCreate,
  userQuery,
  userQueryOne,
  userUpdate,
  userBulkUpdate,
  userDelete
} = require('../utils');

/**
 * @router api/Sms/sendSmsCheckCode
 * @description 短信验证码发送接口
 */
router.post('/sendSmsCheckCode', async ctx => {
  console.log('收到sms请求');

  // sms模板code
  const templateCodeList = {
    register: 'SMS_186576385'
  };

  // 生成四位验证码
  const code = Math.floor(Math.random() * 9000 + 1000);
  console.log('code', code);

  // code 和 phone 存入数据库中
  const { phone, way } = ctx.request.body;
  console.log('phone', phone, way);
  if (phone) {
    await userCreate(Sms_codeSendLogModel, { phone, code });
  }

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
    PhoneNumbers: '15562976106',
    SignName: '大规模虚拟集群管理系统',
    TemplateCode: templateCodeList[way],
    TemplateParam: JSON.stringify({
      code
    })
  };

  const requestOption = {
    method: 'POST'
  };

  ctx.status = 200;
  ctx.body = {
    success: true,
    message: '短信发送成功！'
  };

  // const result = await client.request('SendSms', params, requestOption);
  // const { Code: smsResCode } = result;
  // console.log(result);
  // if (smsResCode === 'OK') {
  //   ctx.status = 200;
  //   ctx.body = {
  //     success: true,
  //     message: '短信发送成功！'
  //   };
  // } else {
  //   ctx.status = 500;
  //   ctx.body = {
  //     success: false,
  //     message: '短信发送失败！'
  //   };
  // }
});

/**
 * @router api/Sms/checkSmsCode
 * @description 对比用户输入的sms验证码是否正确有效接口
 */
router.post('/checkSmsCode', async ctx => {
  console.log('验证sms code');

  const { code, phone } = ctx.request.body;
  const now = Date.now();

  // 数据库中取出对应的验证码和发送时间
  const { createdAt, code: dbCode } = await userQueryOne(
    Sms_codeSendLogModel,
    {
      phone
    },
    { order: [['id', 'DESC']] }
  );

  // 验证码不正确
  ctx.status = 200;
  if (Number(code) !== dbCode) {
    ctx.body = {
      success: false,
      message: '验证码错误！'
    };
  } else if (now - createdAt > 30000000) {
    // 验证码失效
    ctx.body = {
      success: false,
      message: '验证码失效！'
    };
  } else {
    // 验证码正确有效
    ctx.body = {
      success: true,
      message: '验证码正确有效！'
    };
  }
});

module.exports = router.routes();
