/**
 * @description 验证token是否有效
 */
const jwt = require("jsonwebtoken");
const key = require("./key");

module.exports = ctx => {
  if (ctx.header && ctx.header.authorization) {
    console.log("ctx.header", ctx.header);
    const parts = ctx.header.authorization.split(" ");
    if (parts.length === 2) {
      //取出token
      const scheme = parts[0];
      const token = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        console.log(0);
        try {
          //jwt.verify方法验证token是否有效
          jwt.verify(token, key.loginKey, {
            complete: true
          });
        } catch (error) {
          console.log("error", error);
        }
      }
    }
  }
};
