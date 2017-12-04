const router = require('koa-router')();

const { getDepartment } = require('../controllers/department.controller');

router.prefix('/department');

router.get('/getDepartment', getDepartment);

module.exports = router;
