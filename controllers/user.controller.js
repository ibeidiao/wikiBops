

const UserDao = require('../daos/user.dao');
const UserToken = require('../daos/user-token.dao');

const ResponseBody = require('../models/ResponseBody');

const { formatDate, formatPage } = require('../utils/littleUtils');
const md5 = require('../utils/md5');

exports.getInfo = async (ctx) => {
  const { id } = ctx.request.body;

  try {
    const user = (await UserDao.getInfo({ id }))[0];
    if (user) {
      ctx.body = new ResponseBody(user, '获取用户信息成功');
    } else {
      ctx.body = new ResponseBody({}, '用户不存在', 1);
    }
  } catch (err) {
    ctx.body = {
      err,
    };
  }
};

exports.addUser = async (ctx) => {
  const { loginName, password } = ctx.request.body;
  const now = formatDate(new Date());
  const user = Object.assign({}, { loginName, password: md5(password) }, {
    createTime: now,
    modifyTime: now,
    nickName: loginName,
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
    password: md5('123456'),
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

exports.getUserOptions = async (ctx) => {
  const { filter } = ctx.request.body;
  const user = { filter: filter ? `%${filter}%` : filter };
  try {
    const res = await UserDao.getUserOptions(user);
    const resBody = new ResponseBody(res, '获取匹配的用户');
    ctx.body = resBody;
  } catch (err) {
    ctx.body = {
      err,
    };
  }
};

exports.login = async (ctx) => {
  const { loginName, password } = ctx.request.body;
  const ts = ctx.request.header['x-timestamp'];
  const now = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
  try {
    const user = (await UserDao.getUser({ loginName }))[0];
    if (user) {
      if (user.status === 1) {
        ctx.body = new ResponseBody({}, '账户已停用，请联系管理员。', 3);
      } else if (user.password === md5(password)) {
        const token = md5(`ID=${user.id}&LoginName=${user.loginName}&ts=${ts}@@@wiki`);
        const userToken = {
          token,
          userId: user.id,
          createTime: now,
          modifyTime: now,
        };
        await UserToken.insertUserToken(userToken);
        ctx.body = new ResponseBody({ userId: user.id, role: user.role, token }, '登陆成功');
      } else {
        ctx.body = new ResponseBody({}, '用户名密码错误', 2);
      }
    } else {
      ctx.body = new ResponseBody({}, '不存在该用户', 1);
    }
  } catch (err) {
    ctx.body = {
      err,
    };
  }
};
