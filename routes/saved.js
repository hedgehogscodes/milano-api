const router = require('express').Router();
const { validateUserUpdate } = require('../utils/validators');

const { getSaved, createSave, deleteSave, deleteAllSave } = require('../controllers/saved');

router.get('/', getSaved);
router.post('/', createSave);
router.delete('/:_id', deleteSave);
router.delete('/all/:_id', deleteAllSave);

module.exports = router;