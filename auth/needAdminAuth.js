const ResponseBody = require('../models/ResponseBody');
const UserDao = require('../daos/user.dao');

async function needAdminAuth(ctx) {

  if (ctx.role !== 9) {
    ctx.body = new ResponseBody({}, '需要管理员权限操作', 9);
    return false;
  }

  const user = await UserDao.getOne({ id: ctx.userId });

  if (user.role !== ctx.role) {
    ctx.body = new ResponseBody({}, '需要管理员权限操作(登陆信息有误)', 88);
    return false;
  }

  return true;

}

module.exports = needAdminAuth;
