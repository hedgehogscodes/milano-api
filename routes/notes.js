const router = require('express').Router();

const { getNotesByMasterId, createNote, updateNote, deleteNote } = require('../controllers/notes');

router.get('/:id', getNotesByMasterId);
router.post('/',  createNote);
router.patch('/', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
