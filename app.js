const Koa = require('koa');
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa2-cors');

const auth = require('./auth/auth');
const logUtil = require('./utils/logUtil');

const apiRouter = require('./routes/api');

const app = new Koa();

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'],
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(`${__dirname}/public`));

app.use(views(`${__dirname}/views`, {
  extension: 'pug',
}));

app.use(cors({
  credentials: true,
  origin(ctx) {
    return ctx.header.origin;
  },
  allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT'],
}));

// app.use(async function(ctx, next) {
//   console.log(222);
//   ctx.set("Access-Control-Allow-Origin", '*')
//   ctx.set("Access-Control-Allow-Credentials", true);
//   ctx.set("Access-Control-Max-Age", 86400000);
//   ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
//   ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
//   await next()
// })

// // logger
// app.use(async (ctx, next) => {
//   const start = new Date();
//   await next();
//   const ms = new Date() - start;
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
// });

// logger
app.use(async (ctx, next) => {
  // 响应开始时间
  const start = new Date();
  // 响应间隔时间
  let ms;
  try {
    // 开始进入到下一个中间件
    await next();

    ms = new Date() - start;
    // 记录响应日志
    logUtil.logResponse(ctx, ms);
  } catch (error) {
    ms = new Date() - start;
    // 记录异常日志
    logUtil.logError(ctx, error, ms);
  }
});

// 解析cookie token信息。
app.use(async (ctx, next) => {
  try {
    const token = ctx.cookies.get('token');
    if (token) {
      const user = JSON.parse(Buffer.from(decodeURIComponent(token), 'base64').toString());
      ctx.token = user.token;
      ctx.role = user.role;
      ctx.userId = user.userId;
    }
    await next();
  } catch (err) {
    ctx.body = {
      err,
    };
  }
});

// auth
app.use(auth);

// routes
app.use(apiRouter.routes(), apiRouter.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  logUtil.logError(ctx, err, new Date());
  // console.error('server error', err, ctx);
});

module.exports = app;
