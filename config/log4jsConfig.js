const path = require("path");

//日志根目录
const baseLogPath = path.resolve(__dirname, "../logs");

//错误日志目录
const errorPath = "/error";
//错误日志文件名
const errorFileName = "error";
//错误日志输出完整路径
const errorLogPath = baseLogPath + errorPath + "/" + errorFileName;
// const errorLogPath = path.resolve(__dirname, "../logs/error/error");

//响应日志目录
const responsePath = "/response";
//响应日志文件名
const responseFileName = "response";
//响应日志输出完整路径
const responseLogPath = baseLogPath + responsePath + "/" + responseFileName;
// const responseLogPath = path.resolve(__dirname, "../logs/response/response");

module.exports = {
  appenders: {
    errorLogger: { 
      type: 'dateFile', 
      filename: errorLogPath, 
      pattern: '-yyyy-MM-dd-hh.log', 
      alwaysIncludePattern:true, 
      path: errorPath
    },
    resLogger: {
      type: "dateFile", //日志类型
      filename: responseLogPath, //日志输出位置
      pattern: "-yyyy-MM-dd-hh.log", //后缀，每小时创建一个新的日志文件
      alwaysIncludePattern: true, //是否总是有后缀名
      path: responsePath
    }
  },
  categories: {
    default: { appenders: ['resLogger'], level: 'all' },
    errorLogger: { appenders: ['errorLogger'], level: 'error' },
    resLogger: { appenders: ['resLogger'], level: 'all' }
  },
  baseLogPath: baseLogPath //logs根目录
};


