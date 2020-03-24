/**
 *@description users表的Model
 */

const db = require("../db");

const UserModel = db.defineModel("users", {
  userName: db.STRING,
  passWord: db.STRING,
  phone: db.INTEGER
});

module.exports = UserModel;
