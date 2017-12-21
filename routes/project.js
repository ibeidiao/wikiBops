const router = require('koa-router')();

const {
  addProject,
  getProjectList,
} = require('../controllers/project.controller');

router.prefix('/project');

router.post('/addProject', addProject);

router.post('/getProjectList', getProjectList);

module.exports = router;
