const xml2sql = require('../lib/xml2sql/index');
const { connection } = require('../lib/mysql/index');

const path = require('path');

const mapperPath = path.join(__dirname, './department.mapper.xml');

function departmentMapper(id, vo) {
  return xml2sql.getSQL(mapperPath, id, vo);
}

const getDepartment = async function(vo) {
  const sqlArray = [];
  sqlArray.push(departmentMapper('getDepartment', vo));
  return await connection.query(sqlArray[0]);
}

module.exports = {
  getDepartment,
}

