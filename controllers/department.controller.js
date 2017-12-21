const DepartmentDao = require('../daos/department.dao');

exports.getDepartment = async (ctx) => {
  try {
    const content = await DepartmentDao.getDepartment({ id: 10000 });
    ctx.body = {
      content,
    };
  } catch (err) {
    // console.log(err);
  }
};
