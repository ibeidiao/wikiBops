const ResponseBody = require('../models/ResponseBody');
const UserTokenDao = require('../daos/user-token.dao');


async function needLoginAuth(ctx) {

  if (!ctx.userId) {
    ctx.body = new ResponseBody({}, '需要登陆权限操作', 8);
    return false;
  }

  const userToken = await UserTokenDao.getOne({ userId: ctx.userId });

  if (userToken.token !== ctx.token) {
    ctx.body = new ResponseBody({}, '登陆信息不正确，请重新登录', 88);
    return false;
  }

  return true;
}

module.exports = needLoginAuth;
