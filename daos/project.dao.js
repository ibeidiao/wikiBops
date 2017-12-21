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
  
  return await connection.query(sql);
}

const getProjectList = async (project) => {
  const sql1 = projectMapper('getProjectList', project);
  const sql2 = projectMapper('getProjectList-C', project);

  const res1 = await connection.query(sql1);
  const res2 = await connection.query(sql2);

  return Object.assign({}, { list: res1 }, res2[0]);
}

module.exports = {
  addProject,
  getProjectList,
}
