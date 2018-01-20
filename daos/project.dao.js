const xml2sql = require('../lib/xml2sql/index');
const { connection } = require('../lib/mysql/index');

const path = require('path');

const mapperPath = path.join(__dirname, './project.mapper.xml');

function projectMapper(id, project) {
  return xml2sql.getSQL(mapperPath, id, project);
}

const addProject = async (project) => {
  try {
    await connection.beginTran();
    const sql1 = projectMapper('addProject', project);
    const res1 = await connection.query(sql1);
    const relation = {
      projectId: res1.insertId,
      createTime: project.createTime,
      modifyTime: project.modifyTime,
      userId: project.ownerId,
      type: 1,
    };
    const sql2 = projectMapper('addProjectUserRelation', relation);
    await connection.query(sql2);
    await connection.commit();
    return res1;
  } catch(e) {
    await connection.rollback();
    return e;
  } 
}

const getProjectList = async (project) => {
  const sql1 = projectMapper('getProjectList', project);
  const sql2 = projectMapper('getProjectList-C', project);

  const res1 = await connection.query(sql1);
  const res2 = await connection.query(sql2);
  return Object.assign({}, { list: res1 }, res2[0]);
}

const getProjectDetail = async (project) => {
  
  try {
    await connection.beginTran();
    const sql1 = projectMapper('getProjectInfo', project);
    const res1 = await connection.query(sql1);
    
    const sql2 = projectMapper('getProjectUserRelationList', project);
    const res2 = await connection.query(sql2);
    await connection.commit();

    return Object.assign({}, { info: res1[0], memberList: res2 });
    
  } catch (err) {
    await connection.rollback();
    return err;
  }

}

const getProjectInfo = async (project) => {
  
  try {
    const sql = projectMapper('getProjectInfo', project);
    const res = await connection.query(sql);

    return res[0];
  } catch (err) {
    return err;
  }

}

const getOneRelation = async (relation) => {
  const sql = projectMapper('getProjectUserRelation', relation);

  return await connection.query(sql);
}

const addProjectUserRelation = async (relation) => {
  const sql = projectMapper('addProjectUserRelation', relation);

  return await connection.query(sql);
}

const updateProjectUserRelation = async (relation) => {
  const sql = projectMapper('updateProjectUserRelation', relation);

  return await connection.query(sql);
}

const makeOverProject = async (relation) => {

  const { type, projectId, relationId, modifyTime } = relation;

  try {
    await connection.beginTran();

    const sql1 = projectMapper('getProjectOwnerRelationId', { projectId });
    const res1 = await connection.query(sql1);
    const sql2 = projectMapper('updateProjectUserRelation', { id: res1[0].id, type: 0, modifyTime });
    await connection.query(sql2);
    const sql3 = projectMapper('updateProjectUserRelation', { id: relationId, type, modifyTime });
    await connection.query(sql3);
    
    return await connection.commit();
  } catch (e) {
    await connection.rollback();
    return e;
  }
}

const updateProject = async (project) => {
  const sql = projectMapper('updateProject', project);

  return await connection.query(sql);
}

module.exports = {
  addProject,
  getProjectList,
  getProjectDetail,
  addProjectUserRelation,
  updateProjectUserRelation,
  makeOverProject,
  updateProject,
  getProjectInfo,
  getOneRelation,
}
