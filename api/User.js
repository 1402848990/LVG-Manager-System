/**
 * @description User 接口(注册，登录，token验证)
 */
const router = require('koa-router')();
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const key = require('../config/key');
const models = require('../models');
const { UserModel, LoginLogModel } = models;
const {
  userCreate,
  userBulkCreate,
  userQuery,
  userQueryOne,
  userUpdate,
  userBulkUpdate,
  userDelete,
  getClientIP
} = require('../utils');

const Op = Sequelize.Op;

/**
 * @router api/User/login
 * @description 登录接口(手机号或者用户名登录)
 */
router.post('/login', async ctx => {
  console.log('收到登录请求');
  const { userName, passWord, phone, ip, address } = ctx.request.body;
  // 通过手机登录或者用户名登录
  const userInfo = phone
    ? await userQueryOne(UserModel, { phone })
    : await userQueryOne(UserModel, { userName });
  // 用户名或手机号是否存在
  if (!userInfo) {
    ctx.status = 200;
    ctx.body = {
      success: false,
      message: `${phone ? '手机号' : '用户'}:${
        phone ? phone : userName
      }不存在！`
    };
  } else {
    // 密码是否正确
    const { passWord: dbPass, id, phone: dbphone } = userInfo;
    let checkPass = true;
    if (!phone) {
      checkPass = bcrypt.compareSync(passWord, dbPass);
    }
    if (checkPass) {
      // console.log('ctx', getClientIP(ctx.request));
      console.log('ip', ctx.request.ip);

      // 密码正确
      const user = {
        userName,
        id,
        phone: dbphone
      };
      // 生成token 有效期1小时
      const token = jwt.sign(user, key.loginKey, {
        expiresIn: 3600
      });
      // 在header中返回token
      ctx.res.setHeader('Authorization', token);
      ctx.set('token', token);
      ctx.status = 200;
      ctx.body = {
        success: true,
        message: '登录成功！',
        token: `Bearer ${token}`,
        userName,
        id
      };

      // 登录信息存到loginLog数据表中
      await userCreate(LoginLogModel, {
        uid: id,
        ip,
        address,
        type: phone ? 'phone' : 'userName'
      });
    } else {
      // 密码错误
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: '密码错误！'
      };
    }
  }
});

/**
 * @router POST api/User/userInfo
 * @description 返回用户信息
 * @access 私密
 */
router.post('/userInfo', async ctx => {
  console.log('ctx', ctx.state);
  const { id } = ctx.state.user;
  const info = await userQueryOne(UserModel, { id });
  ctx.body = {
    success: true,
    info
  };
});

/**
 * @route api/User/register
 * @description 注册接口
 */
router.post('/register', async ctx => {
  console.log('register请求：', ctx.request.body);
  const { userName, passWord, phone } = ctx.request.body;
  // 加密密码
  const hashPassword = bcrypt.hashSync(passWord, 10);
  try {
    // 查询数据库是否已经存在相同的手机号或者用户名
    const repeat = await userQueryOne(UserModel, {
      [Op.or]: [{ userName }, { phone }]
    });
    if (repeat) {
      // 手机号或用户名已存在
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: '手机号或用户名已存在！'
      };
    } else {
      // 可以注册
      const res = await userCreate(UserModel, {
        userName,
        passWord: hashPassword,
        phone
      });
      ctx.status = 200;
      ctx.body = {
        success: true,
        message: '恭喜您~注册成功！'
      };
    }
  } catch (err) {
    console.log('err', err);
    ctx.status = 500;
    ctx.body = '服务器错误!';
  }
});

/**
 * @route api/User/loginLog
 * @description 获取用户登录日志
 */
router.post('/loginLog', async ctx => {
  const { id: uid } = ctx.request.body;
  const res = await userQuery(
    LoginLogModel,
    {
      uid: Number(uid)
    },
    { order: [['id', 'DESC']] }
  );
  // console.log('登录日志：', res);
  const total = await LoginLogModel.count({ where: { uid: Number(uid) } });
  console.log('total', total);

  ctx.status = 200;
  ctx.body = {
    success: true,
    data: res
  };
});

module.exports = router.routes();
