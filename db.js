/**
 * 统一model的规范
 */

const Sequelize = require('sequelize')
const uuid = require('node-uuid')
const { dbname, username, password, host } = require('./config/mysqlConfig')

//生成唯一id
function generateId() {
  return uuid.v4()
}

// 实例化sequelize
const sequelize = new Sequelize(dbname, username, password, {
  host,
  dialect: 'mysql',
  logging: false, //不打印log
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
})

/**
 * 测试数据库连接
 */
async function testDBConnect() {
  try {
    await sequelize.authenticate()
    console.log('临大信息学院辅导员助手mysql链接成功！')
  } catch (err) {
    console.log('临大信息学院辅导员助手mysql链接失败！', err)
  }
}

const ID_TYPE = Sequelize.INTEGER
function configureModel(name, attr) {
  testDBConnect()
  const attrs = {}
  for (const key in attr) {
    let value = attr[key]
    if (typeof value === 'object' && value['type']) {
      // not null=false
      value.allowNull = value.allowNull || false
      attrs[key] = value
    } else {
      attrs[key] = {
        type: value,
        allowNull: false,
      }
    }
  }
  // 创建时间
  attrs.createdAt = {
    type: Sequelize.BIGINT,
    allowNull: true,
  }
  // 更新时间
  attrs.updatedAt = {
    type: Sequelize.BIGINT,
    allowNull: true,
  }
  return sequelize.define(name, attrs, {
    tableName: name,
    timestamps: false,
    hooks: {
      beforeBulkCreate: (obj, options) => {},
      beforeBulkDestroy: (options) => {},
      beforeBulkUpdate: (options) => {
        options.individualHooks = true
        options.personalHooks = true
      },
      beforeBulkDestroy: (options) => {},
      beforeValidate: (obj, options) => {
        options.individualHooks = true
        options.personalHooks = true
      },
      afterValidate: (obj, options) => {},
      beforeCreate: (obj) => {
        const now = Date.now()
        // insert 之前赋创建时间、更新时间、版本号
        obj.createdAt = now
        obj.updatedAt = now
      },
      beforeUpdate: (obj) => {
        const now = Date.now()

        obj.updatedAt = now
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
      afterBulkUpdate: (options) => {
        // console.log("afterBulkUpdate");
      },
      afterBulkDestroy: (options) => {
        // console.log("afterBulkDestroy");
      },
    },
  })
}

const TYPES = [
  'STRING',
  'INTEGER',
  'BIGINT',
  'TEXT',
  'DOUBLE',
  'DATEONLY',
  'BOOLEAN',
  'FLOAT',
]

var exp = {
  configureModel: configureModel,
  sync: () => {
    if (process.env.NODE_ENV !== 'production') {
      sequelize.sync({ force: true })
    } else {
      throw new Error("Cannot sync() when NODE_ENV is set to 'production'.")
    }
  },
}

for (let type of TYPES) {
  exp[type] = Sequelize[type]
}

exp.ID = ID_TYPE
exp.generateId = generateId
exp.sequelize = sequelize

module.exports = exp
