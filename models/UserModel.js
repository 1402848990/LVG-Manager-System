/**
 * users表的Model
 */

const db = require("../db");

const UserModel = db.defineModel("users", {
  username: db.STRING,
  password: db.STRING
});

module.exports = UserModel;
