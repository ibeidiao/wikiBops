const UserDao = require('../daos/user.dao');

const ResponseBody = require('../models/ResponseBody');

const { formatDate, formatPage } = require('../utils/littleUtils');

exports.getUser = async (ctx) => {
  ctx.body = {
    username: '咸鱼',
    age: 30,
  };
};

exports.addUser = async (ctx) => {
  const { body } = ctx.request;
  const now = formatDate(new Date());
  const user = Object.assign({}, body, {
    createTime: now,
    modifyTime: now,
    nickName: body.loginName,
    creatorId: 10000,
  });
  try {
    const res = await UserDao.addUser(user);
    const resBody = new ResponseBody({ insertId: res.insertId }, '添加成功');
    ctx.body = resBody;
  } catch (err) {
    ctx.body = {
      err,
    };
  }
};

exports.resetPwd = async (ctx) => {
  const { body } = ctx.request;
  const now = formatDate(new Date());
  const user = Object.assign({}, {
    id: body.id,
    modifyTime: now,
    password: '123456',
  });
  try {
    await UserDao.updateUser(user);
    const resBody = new ResponseBody({}, '更新密码成功');
    ctx.body = resBody;
  } catch (err) {
    ctx.body = {
      err,
    };
  }
};

exports.getUserList = async (ctx) => {
  const { body } = ctx.request;
  const { pageNum, pageSize, filter } = body;
  const page = formatPage(pageNum, pageSize);
  const user = Object.assign({}, {
    filter,
  }, page);
  try {
    const res = await UserDao.getUserList(user);
    const resBody = new ResponseBody(res, '获取用户列表成功');
    ctx.body = resBody;
  } catch (err) {
    ctx.body = {
      err,
    };
  }
};

exports.setStatus = async (ctx) => {
  const { body } = ctx.request;
  const now = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
  const { status, id } = body;
  const user = Object.assign({}, { id, status, modifyTime: now });
  try {
    await UserDao.updateUser(user);
    const resBody = new ResponseBody({}, '设置用户状态成功');
    ctx.body = resBody;
  } catch (err) {
    ctx.body = {
      err,
    };
  }
};
