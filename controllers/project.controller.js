const ProjectDao = require('../daos/project.dao');

const ResponseBody = require('../models/ResponseBody');

const { formatDate, formatPage } = require('../utils/littleUtils');

exports.addProject = async (ctx) => {
  const { body } = ctx.request;
  const now = formatDate(new Date());
  const project = Object.assign({}, body, {
    createTime: now,
    modifyTime: now,
    creatorId: 10034,
    ownerId: 10034,
    updaterId: 10034,
  });
  try {
    const res = await ProjectDao.addProject(project);
    const resBody = new ResponseBody({ insertId: res.insertId }, '添加成功');
    ctx.body = resBody;
  } catch (err) {
    ctx.body = {
      err,
    };
  }
};

exports.getProjectList = async (ctx) => {
  const {
    pageNum, pageSize, filter, ownerId, userId,
  } = ctx.request.body;
  const page = formatPage(pageNum, pageSize);
  const project = Object.assign({}, {
    userId,
    ownerId,
    filter,
  }, page);
  try {
    const res = await ProjectDao.getProjectList(project);
    const resBody = new ResponseBody(res, '获取项目列表成功');
    ctx.body = resBody;
  } catch (err) {
    ctx.body = {
      err,
    };
  }
};
