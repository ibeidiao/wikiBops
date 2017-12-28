const router = require('koa-router')();

const {
  getUser,
  addUser,
  resetPwd,
  getUserList,
  setStatus,
  checkLoginNameUnique,
  getUserOptions,
} = require('../controllers/user.controller');

router.prefix('/user');

router.get('/getUser', getUser);

router.post('/addUser', addUser);

router.post('/resetPwd', resetPwd);

router.post('/getUserList', getUserList);

router.post('/setStatus', setStatus);

router.post('/checkLoginNameUnique', checkLoginNameUnique);

router.post('/getUserOptions', getUserOptions);

module.exports = router;
