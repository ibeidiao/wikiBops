
const needAdminAuth = require('./needAdminAuth');
const needLoginAuth = require('./needLoginAuth');

function commonAuth() {
  return true;
}

function specialAuth() {
  return true;
}


const cache = {};

const authUrls = [
  { reg: /.*/, needAuth: [commonAuth] },
  { reg: /\/api\//, exclude: /\/api\/user\/login/, needAuth: [commonAuth, specialAuth, needLoginAuth] },
  { reg: /\/api\/user\/[(addUser)|(resetPwd)|(setStatus)]/, needAuth: [needAdminAuth, needLoginAuth] },
];

/**
 * 数组去重
 *
 * @param {*} array
 */
function removeDuplicate(array) {
  return Array.from(new Set(array));
}

/**
 *
 * @param {string} path 此次path
 *
 * @return {Array<Function(): boolen>} 需要权限验证的方法
 */
function getNeedAuth(path) {
  if (cache[path]) { return cache[path]; }
  const needAuth = authUrls.reduce((arr, curr) => {
    if (new RegExp(curr.reg, 'i').test(path) && !(curr.exclude && new RegExp(curr.exclude, 'i').test(path))) { return [...arr, ...curr.needAuth]; }
    return arr;
  }, []);
  cache[path] = removeDuplicate(needAuth);
  return cache[path];
}

/**
 *
 * @param {Array<Function(): boolen>} allNeedAuth
 * @param {context} ctx
 *
 * @return {boolean}  是否拥有权限
 */
async function hasAuth(allNeedAuth, ctx) {
  const promises = allNeedAuth.map(needAuth => needAuth.call(null, ctx));
  const auths = await Promise.all(promises);
  return auths.every(b => b);
}

async function auth(ctx, next) {
  const isAllowed = await hasAuth(getNeedAuth(ctx.path), ctx);
  if (isAllowed) { await next(); }
}

module.exports = auth;
