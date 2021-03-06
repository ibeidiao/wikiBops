const mysql = require('mysql');
const PoolConnection = require('./Connection').PoolConnection;

const $originPool = Symbol('originPool');
const $isAlive = Symbol('isAlive');

function handleError(config) {
  this[$originPool] = mysql.createPool(config);
  this[$isAlive] = true;

  this[$originPool].on('error', (err) => {
    console.log(err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleError.call(this, config);
    } else {
      throw err;
    }
  });
}

/**
 * Pool is the class that contains functions each returns promise.
 * These functions are just converted from the Mysql.Pool object.
 */
class Pool {
  /**
   * Constructor, initialize the pool.
   * @param {Object} config The pool config.
   */
  constructor(config) {
    // this[$originPool] = mysql.createPool(config);
    // this[$isAlive] = true;
    handleError.call(this, config);
  }

  /**
   * Orders the pool config.
   */
  get config() {
    return this[$originPool].config;
  }

  /**
   * Orders the pool is destroyed or not.
   */
  get isAlive() {
    return this[$isAlive];
  }

  /**
   * Add listener to the pool.
   */
  get on() {
    return this[$originPool].on;
  }

  /**
   * Get a connection object from the pool.
   * @return {Promise<PoolConnection>}
   */
  getConn() {
    return new Promise((resolve, reject) => {
      this[$originPool].getConnection((err, originConn) => {
        if (err) { return reject(err); }
        const conn = new PoolConnection(originConn);
        return resolve(conn);
      });
    });
  }

  /**
   * Ternimate the pool. This function would ternimate the pool after any query being complete.
   */
  end() {
    return new Promise((resolve, reject) => {
      this[$originPool].end((err) => {
        if (err) { return reject(err); }
        this[$isAlive] = false;
        return resolve();
      });
    });
  }

  /**
   * Use a connection to query a sql command with parameters.
   * @param {String} cmd The sql command would be executed.
   * @param {Array} params Parameters.
   * @return {Promise<any>}
   */
  query(cmd, params) {
    return new Promise((resolve, reject) => {
      const args = [cmd];
      const callback = (err, rst) => {
        if (err) reject(err);
        else resolve(rst);
      };
      if (params) { args.push(params); }
      args.push(callback);
      this[$originPool].query(...args);
    });
  }
}

module.exports.Pool = Pool;
