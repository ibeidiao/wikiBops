const xml2sql = require('../lib/xml2sql/index');
const { connection } = require('../lib/mysql/index');

const path = require('path');

const mapperPath = path.join(__dirname, './user-token.mapper.xml');

function userTokenMapper(id, userToken) {
  return xml2sql.getSQL(mapperPath, id, userToken);
}

const insertUserToken = async (userToken) => {
  const { userId } = userToken;
  try {
    await connection.beginTran();
    const sql1 = userTokenMapper('deleteUserToken', { userId });
    await connection.query(sql1);
    const sql2 = userTokenMapper('addUserToken', userToken);
    const res1 = await connection.query(sql2);
    await connection.commit();
    return res1;
  } catch(e) {
    await connection.rollback();
    return e;
  } 
}

const getOne = async (userToken) => {
  const { userId } = userToken;
  try {
    const sql = userTokenMapper('getOne', { userId });
    
    const res = await connection.query(sql);

    return res[0];
  } catch (e) {
    return e;
  }
}

module.exports = {
  insertUserToken,
  getOne,
}
