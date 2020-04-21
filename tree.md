.
├── README.md ---README 文件
├── api ---接口与中间件目录
│   ├── Bell.js ---消息通知接口
│   ├── CpuWs.js ---主机基础数据接口
│   ├── Host.js ---主机接口
│   ├── Logs.js ---日志相关接口
│   ├── NetWs.js ---网络数据相关接口
│   ├── SMS.js ---SMS 服务接口
│   ├── User.js ---用户接口
│   ├── WarnMonitor.js ---预警监控中间件
│   ├── WarnSetting.js ---预警设置接口
│   └── dataDestory.js ---数据库数据自动清理中间件
├── app.js ---项目入口
├── assets ---静态文件
├── config ---配置目录
│   ├── config.js ---数据库相关配置
│   ├── key.js ---加密秘钥
│   ├── passport.js ---token 解析
│   └── tokenCheck.js ---鉴权中间件
├── dataWriteSystem ---数据仿真生成写入服务目录
│   ├── cpuCreate.js ---基本数据服务
│   ├── diskCreate.js ---磁盘数据服务
│   └── netCreate.js ---网络数据服务
├── db.js ---Sequlize 封装
├── models ---ORMmodel 目录
│   ├── CpuLogsModel.js
│   ├── DiskLogsModel.js
│   ├── GpuLogsModel.js
│   ├── HostModel.js
│   ├── LoginLogModel.js
│   ├── NetLogsModel.js
│   ├── OperationLogsModel.js
│   ├── Sms_codeSendLogModel.js
│   ├── UserModel.js
│   ├── WarnLogsModel.js
│   └── WarnOptionsModel.js
├── models.js ---自动扫描抛出
├── package-lock.json
├── package.json ---依赖包 JSON
├── tree.md
└── utils ---工具包
└── index.js
