const Connection = require('./lib/Connection').Connection;
const Pool = require('./lib/Pool').Pool;
const config = require('./config');

const pool = new Pool(config);
const connection = new Connection(config);

module.exports = { pool, connection };