const router = require('koa-router')();

const { getUser } = require('../controllers/user.controller');

router.prefix('/user');

router.get('/getUser', getUser);

module.exports = router;
