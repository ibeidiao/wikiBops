const router = require('koa-router')();

const {
  getInfo,
  addUser,
  resetPwd,
  getUserList,
  setStatus,
  checkLoginNameUnique,
  getUserOptions,
  login,
} = require('../controllers/user.controller');

router.prefix('/user');

router.post('/getInfo', getInfo);

router.post('/addUser', addUser);

router.post('/resetPwd', resetPwd);

router.post('/getUserList', getUserList);

router.post('/setStatus', setStatus);

router.post('/checkLoginNameUnique', checkLoginNameUnique);

router.post('/getUserOptions', getUserOptions);

router.post('/login', login);

module.exports = router;
