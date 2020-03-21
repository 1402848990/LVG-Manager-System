/**
 * students 表的Model
 */
const db = require("../db");

const StuModel = db.defineModel("students", {
  name: db.STRING,
  age: {
    type: db.INTEGER,
    allowNull: true
  }
});

module.exports = StuModel;
