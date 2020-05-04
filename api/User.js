/**
 * @description User 接口(注册，登录，token验证)
 */
const router = require('koa-router')();
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const key = require('../config/key');
const axios = require('axios');
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
  console.log('-------收到登录请求', ctx.request.ip);
  const { userName, passWord, phone } = ctx.request.body;
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
    const {
      passWord: dbPass,
      id,
      phone: dbphone,
      userName: dbusername
    } = userInfo;
    let checkPass = true;
    if (!phone) {
      checkPass = bcrypt.compareSync(passWord, dbPass);
    }
    if (checkPass) {
      // console.log('ctx', getClientIP(ctx.request));

      // 密码正确
      const user = {
        userName,
        id,
        phone: dbphone
      };
      // 生成token 有效期1小时
      const token = jwt.sign(user, key.loginKey, {
        expiresIn: 8000
      });
      // 在header中返回token
      ctx.res.setHeader('Authorization', token);
      ctx.set('token', token);
      ctx.status = 200;
      ctx.body = {
        success: true,
        message: '登录成功！',
        token: `Bearer ${token}`,
        userName: userName || dbusername,
        id
      };

      // 获取精确地理位置
      const address = await getGps(ctx.request.ip);

      // 登录信息存到loginLog数据表中
      await userCreate(LoginLogModel, {
        uid: id,
        ip: ctx.request.ip,
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
 */
router.post('/userInfo', async ctx => {
  const { id } = ctx.request.body;
  const info = await userQueryOne(UserModel, { id });
  ctx.body = {
    success: true,
    info
  };
});

/**
 * @router POST api/User/editUserInfo
 * @description 修改用户信息
 */
router.post('/editUserInfo', async ctx => {
  const { id, changeData } = ctx.request.body;
  const info = await UserModel.update(
    { ...changeData },
    {
      where: {
        id
      }
    }
  );
  ctx.body = {
    success: true,
    info
  };
});

/**
 * @router POST api/User/changePassWord
 * @description 修改密码
 */
router.post('/changePassWord', async ctx => {
  const { id, passWord } = ctx.request.body;
  const hashPassword = bcrypt.hashSync(passWord, 10);
  const info = await UserModel.update(
    { passWord: hashPassword },
    {
      where: {
        id
      }
    }
  );
  ctx.body = {
    success: true
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

// 获取登录信息
async function getGps(ip) {
  ip.includes('::1') ? (ip = '') : null;
  const token = '407a2cf82309fdf5ca8549f53a61b776';
  const res = await axios.get(
    `http://api.ip138.com/query/?ip=${ip}&token=${token}`
  );
  console.log('-----------res', res.data);
  return `${res.data.data[1]}省${res.data.data[2]}市`;
}

module.exports = router.routes();
