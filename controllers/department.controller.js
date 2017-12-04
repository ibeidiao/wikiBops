const DepartmentDao = require('../daos/department.dao');

exports.getDepartment = async (ctx, next) => {
  try {
    let content;
    content = await DepartmentDao.getDepartment({id: 10000});
    ctx.body = {
      content
    }
  } catch (err) {
    console.log(err);
  }
}