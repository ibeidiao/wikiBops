const router = require('koa-router')();

const {
  addProject,
  getProjectList,
  getProjectDetail,
  addProjectUserRelation,
  removeProjectUserRelation,
  makeOverProject,
  setStatus,
  editProject,
  getProjectInfo,
} = require('../controllers/project.controller');

router.prefix('/project');

router.post('/addProject', addProject);

router.post('/getProjectList', getProjectList);

router.post('/getProjectDetail', getProjectDetail);

router.post('/addProjectUserRelation', addProjectUserRelation);

router.post('/removeProjectUserRelation', removeProjectUserRelation);

router.post('/makeOverProject', makeOverProject);

router.post('/setStatus', setStatus);

router.post('/editProject', editProject);

router.post('/getProjectInfo', getProjectInfo);

module.exports = router;
