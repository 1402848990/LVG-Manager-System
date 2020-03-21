/**
 * @description User 接口(注册，登录，token验证)
 */
const router = require("koa-router")();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("koa-passport");
const key = require("../config/key");
const {
  userCreate,
  userBulkCreate,
  userQuery,
  userQueryOne,
  userUpdate,
  userBulkUpdate,
  userDelete
} = require("../utils");

/**
 * @router api/User/login
 * @description 登录接口
 */
router.post("/login", async ctx => {
  console.log("收到登录请求");
  const { username, password } = ctx.request.body;
  const userInfo = await userQueryOne({ username });
  // 用户书否存在
  if (!userInfo) {
    ctx.status = 404;
    ctx.body = `用户:${username}不存在！`;
  } else {
    // 密码是否正确
    const { password: dbPass, id } = userInfo;
    const checkPass = bcrypt.compareSync(password, dbPass);
    if (checkPass) {
      // 密码正确
      const user = {
        username,
        id
      };
      // 生成token 有效期1小时
      const token = jwt.sign(user, key.loginKey, {
        expiresIn: 20
      });
      ctx.status = 200;
      // 在header中返回token
      ctx.res.setHeader("token", token);
      ctx.body = {
        success: true,
        token: `Bearer ${token}`
      };
    } else {
      // 密码错误
      ctx.status = 400;
      ctx.body = "密码错误！";
    }
  }
});

/**
 * @router GET api/User/current
 * @description 返回用户信息
 * @access 私密
 */
router.get(
  "/current",
  // passport.authenticate("jwt", { session: false }),
  async ctx => {
    console.log(1);
    ctx.body = {
      success: true
      // data: ctx.state.user
    };
  }
);

/**
 * @route api/User/register
 * @description 注册接口
 */
router.post("/register", async ctx => {
  console.log("post请求：", ctx.request.body);
  const { username, password } = ctx.request.body;
  // 加密密码
  const hashPassword = bcrypt.hashSync(password, 10);
  try {
    const res = await userCreate({ username, password: hashPassword });
    ctx.status = 200;
    ctx.body = "success!";
  } catch (err) {
    console.log("err", err);
    ctx.status = 500;
    ctx.body = "服务器错误!";
  }
});

module.exports = router.routes();
