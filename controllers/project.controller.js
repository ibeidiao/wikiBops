const ProjectDao = require('../daos/project.dao');

const ResponseBody = require('../models/ResponseBody');

const { formatDate, formatPage } = require('../utils/littleUtils');

exports.addProject = async (ctx) => {
  const { body } = ctx.request;
  const { userId } = ctx;
  const now = formatDate(new Date());
  const project = Object.assign({}, body, {
    createTime: now,
    modifyTime: now,
    creatorId: userId,
    ownerId: userId,
    updaterId: userId,
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
    pageNum, pageSize, filter, ownerId,
  } = ctx.request.body;
  let { userId } = ctx;
  let type;
  if (userId === 10000) {
    userId = undefined;
    type = 1;
  }
  const page = formatPage(pageNum, pageSize);
  const project = Object.assign({}, {
    userId,
    ownerId,
    filter,
    type,
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

exports.getProjectDetail = async (ctx) => {
  const { id } = ctx.request.body;
  try {
    const res = await ProjectDao.getProjectDetail({ id });
    const resBody = new ResponseBody(res, '获取项目详情信息成功');
    ctx.body = resBody;
  } catch (err) {
    ctx.body = {
      err,
    };
  }
};

exports.getProjectInfo = async (ctx) => {
  const { id }  = ctx.request.body;
  try {
    const res = await ProjectDao.getProjectInfo({ id });
    const resBody = new ResponseBody(res, '获取项目基本信息成功');
    ctx.body = resBody;
  } catch (err) {
    ctx.body = {
      err,
    };
  }
};

exports.addProjectUserRelation = async (ctx) => {
  const { projectId, userId, type } = ctx.request.body;
  const now = formatDate(new Date());
  const relation = {
    projectId,
    userId,
    type,
    createTime: now,
    modifyTime: now,
  };
  try {
    const res = await ProjectDao.addProjectUserRelation(relation);
    const resBody = new ResponseBody({ insertId: res.insertId }, '添加成员成功');
    ctx.body = resBody;
  } catch (err) {
    ctx.body = {
      err,
    };
  }
};

exports.removeProjectUserRelation = async (ctx) => {
  const { id } = ctx.request.body;
  const now = formatDate(new Date());
  const relation = {
    id,
    status: 1,
    modifyTime: now,
  };
  try {
    await ProjectDao.updateProjectUserRelation(relation);
    const resBody = new ResponseBody({}, '删除成员成功');
    ctx.body = resBody;
  } catch (err) {
    ctx.body = {
      err,
    };
  }
};

exports.makeOverProject = async (ctx) => {
  const { projectId, relationId } = ctx.request.body;
  const now = formatDate(new Date());
  const relation = {
    projectId,
    relationId,
    modifyTime: now,
    type: 1,
  };
  try {
    await ProjectDao.makeOverProject(relation);
    const resBody = new ResponseBody({}, '项目转让成功');
    ctx.body = resBody;
  } catch (err) {
    ctx.body = {
      err,
    };
  }
};

exports.setStatus = async (ctx) => {
  const { status, id } = ctx.request.body;
  const now = formatDate(new Date());
  const project = { status, id, modifyTime: now };
  try {
    await ProjectDao.updateProject(project);
    const resBody = new ResponseBody({}, '设置项目状态成功');
    ctx.body = resBody;
  } catch (err) {
    ctx.body = {
      err,
    };
  }
};

exports.editProject = async (ctx) => {
  const { id, name, description } = ctx.request.body;
  const now = formatDate(new Date());
  const project = {
    id, name, description, modifyTime: now,
  };
  try {
    await ProjectDao.updateProject(project);
    const resBody = new ResponseBody({}, '更新项目状态成功');
    ctx.body = resBody;
  } catch (err) {
    ctx.body = {
      err,
    };
  }
};
