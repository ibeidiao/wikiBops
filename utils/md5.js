const crypto = require('crypto');

const md5 = (str, encoding = 'hex') => {
  const hash = crypto.createHash('md5');

  hash.update(str);

  return hash.digest(encoding);
};

module.exports = md5;
