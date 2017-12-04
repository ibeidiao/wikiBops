const router = require('koa-router')();

const userRouter = require('./user');
const departmentRouter = require('./department');

router.prefix('/api');

router.use(departmentRouter.routes(), departmentRouter.allowedMethods());
router.use(userRouter.routes(), userRouter.allowedMethods());

module.exports = router;
