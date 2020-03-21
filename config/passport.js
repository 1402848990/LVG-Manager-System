/**
 * token的处理
 */

const key = require("./key");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const { userQueryOne } = require("../utils");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.loginKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      console.log("jwt_payload", jwt_payload);
      const user = await userQueryOne({ id: jwt_payload.id });
      // user信息存到ctx.state.user中
      return user ? done(null, user) : done(null, false);
    })
  );
};
