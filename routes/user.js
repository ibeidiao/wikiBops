const router = require('koa-router')();

const {
  getUser,
  addUser,
  resetPwd,
  getUserList,
  setStatus,
} = require('../controllers/user.controller');

router.prefix('/user');

router.get('/getUser', getUser);

router.post('/addUser', addUser);

router.post('/resetPwd', resetPwd);

router.post('/getUserList', getUserList);

router.post('/setStatus', setStatus);

module.exports = router;
