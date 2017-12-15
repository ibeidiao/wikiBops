const xml2sql = require('../lib/xml2sql/index');
const { connection } = require('../lib/mysql/index');

const path = require('path');

const mapperPath = path.join(__dirname, './user.mapper.xml');

function userMapper(id, user) {
  return xml2sql.getSQL(mapperPath, id, user);
}

const addUser = async (user) => {
  const sql = userMapper('addUser', user);
  return await connection.query(sql);
}

const updateUser = async (user) => {
  const sql = userMapper('updateUser', user);
  return res = await connection.query(sql);
}

const getUserList = async (user) => {
  const sql1 = userMapper('getUserList', user);
  const sql2 = userMapper('getUserList-C', user);

  const res1 = await connection.query(sql1);
  const res2 = await connection.query(sql2);

  return Object.assign({}, { list: res1 }, res2[0]);
}

module.exports = {
  addUser,
  updateUser,
  getUserList,
}
