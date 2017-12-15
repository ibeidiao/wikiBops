
// const DepartmentDao = require('../daos/department.dao');

function commonAuth() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

function specialAuth() {
  // ctx.body = {
  //   message: 'specialAuth权限不足',
  // };
  return true;
}

// function isExistAuth(ctx) {
//   return new Promise(async (resolve) => {
//     const content = await DepartmentDao.getDepartment({ id: 10000 });
//     if (content.length && content.length > 0) {
//       resolve(true);
//     } else {
//       ctx.body = {
//         message: 'isExistAuth权限不足',
//       };
//       resolve(false);
//     }
//   });
// }

const cache = {};

const authUrls = [
  { reg: /.*/, needAuth: [commonAuth] },
  { reg: /\/api\//, needAuth: [commonAuth, specialAuth] },
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
    if (new RegExp(curr.reg, 'i').test(path)) { return [...arr, ...curr.needAuth]; }
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
