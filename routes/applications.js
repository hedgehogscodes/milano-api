const router = require('express').Router();

const { getApplications, createApplication, deleteApplication } = require('../controllers/applications');

router.get('/:_id', getApplications);
router.post('/',  createApplication);
router.delete('/:_id', deleteApplication);

module.exports = router;
