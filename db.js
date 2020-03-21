/**
 * 统一model的规范
 */

const Sequelize = require("sequelize");
const uuid = require("node-uuid");
const { dbname, username, password, host } = require("./config/config");

//生成唯一id
function generateId() {
  return uuid.v4();
}

// 实例化sequelize
const sequelize = new Sequelize(dbname, username, password, {
  host,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

/**
 * 测试数据库连接
 */
async function testDBConnect() {
  try {
    await sequelize.authenticate();
    console.log("数据库连接成功！");
  } catch (err) {
    console.log("数据库连接失败--", err);
  }
}

/**
 * model规范
 * 1.主键名为id，int类型
 * 2.每个model都加creatAt/updateAt/version
 * 3.字段默认not null=true
 */
const ID_TYPE = Sequelize.INTEGER;

function defineModel(name, attributes) {
  testDBConnect();
  let attrs = {};
  for (let key in attributes) {
    let value = attributes[key];
    if (typeof value === "object" && value["type"]) {
      value.allowNull = value.allowNull || false;
      attrs[key] = value;
    } else {
      attrs[key] = {
        type: value,
        allowNull: false
      };
    }
  }
  attrs.uniqueId = {
    type: Sequelize.STRING,
    // primaryKey: true,
    // autoIncrement: true,
    uniqu: true,
    defaultValue: generateId()
  };
  attrs.createdAt = {
    type: Sequelize.BIGINT,
    allowNull: true
  };
  attrs.updatedAt = {
    type: Sequelize.BIGINT,
    allowNull: true
  };
  attrs.version = {
    type: Sequelize.BIGINT,
    allowNull: true
  };
  return sequelize.define(name, attrs, {
    tableName: name,
    timestamps: false,
    hooks: {
      beforeBulkCreate: (obj, options) => {
        // console.log("beforeBulkCreate");
        // console.log("create--", obj, options);
        // options.individualHooks = true;
      },
      beforeBulkDestroy: options => {
        // console.log("beforeBulkDestroy(options)");
      },
      beforeBulkUpdate: options => {
        // console.log("beforeBulkUpdate-----------");
        options.individualHooks = true;
        options.personalHooks = true;
      },
      beforeBulkDestroy: options => {
        // console.log("beforeBulkDestroy");
      },
      beforeValidate: (obj, options) => {
        // console.log("beforeValidate");
        // console.log("beforeValidate-obj");
        options.individualHooks = true;
        options.personalHooks = true;
      },
      afterValidate: (obj, options) => {
        // console.log("afterValidate");
      },
      beforeCreate: obj => {
        // console.log("beforeCreate");
        const now = Date.now();
        // insert 之前赋创建时间、更新时间、版本号
        obj.createdAt = now;
        obj.updatedAt = now;
        obj.version = 0;
      },
      beforeUpdate: obj => {
        // console.log("beforeUpdate");
        const now = Date.now();
        // console.log("will update entity...", now);
        obj.updatedAt = now;
        obj.version++;
      },
      beforeSave: (obj, options) => {
        // console.log("beforeSave");
      },
      beforeDestroy: (obj, options) => {
        // console.log("beforeDestroy");
      },
      afterCreate: (obj, options) => {
        // console.log("afterCreate");
      },
      afterDestroy: (instance, options) => {
        // console.log("afterDestroy");
      },
      afterUpsert: (created, options) => {
        // console.log("afterUpsert");
      },
      afterSave: (instance, options) => {
        // console.log("afterSave");
      },
      afterBulkCreate: (instances, options) => {
        // console.log("afterBulkCreate");
      },
      afterBulkUpdate: options => {
        // console.log("afterBulkUpdate");
      },
      afterBulkDestroy: options => {
        // console.log("afterBulkDestroy");
      }
    }
  });
}

const TYPES = [
  "STRING",
  "INTEGER",
  "BIGINT",
  "TEXT",
  "DOUBLE",
  "DATEONLY",
  "BOOLEAN"
];

var exp = {
  defineModel: defineModel,
  sync: () => {
    // only allow create ddl in non-production environment:
    if (process.env.NODE_ENV !== "production") {
      sequelize.sync({ force: true });
    } else {
      throw new Error("Cannot sync() when NODE_ENV is set to 'production'.");
    }
  }
};

for (let type of TYPES) {
  exp[type] = Sequelize[type];
}

exp.ID = ID_TYPE;
exp.generateId = generateId;
exp.sequelize = sequelize;

module.exports = exp;
