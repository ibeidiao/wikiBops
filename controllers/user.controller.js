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
  const { id } = ctx.request.body;
  const now = formatDate(new Date());
  const user = Object.assign({}, {
    id,
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
  const { pageNum, pageSize, filter } = ctx.request.body;
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
  const { status, id } = ctx.request.body;
  const now = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
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

exports.checkLoginNameUnique = async (ctx) => {
  const { loginName } = ctx.request.body;
  const user = Object.assign({}, { loginName });
  try {
    const result = await UserDao.getUserListCount(user);
    if (result.count === 0) {
      ctx.body = new ResponseBody({}, '不存在相同登录名用户');
    } else {
      ctx.body = new ResponseBody({}, '存在相同登陆名用户', 100);
    }
  } catch (err) {
    ctx.body = {
      err,
    };
  }
};
