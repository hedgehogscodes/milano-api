const router = require('express').Router();
const { validateCreateMovie, validateDeleteMovie } = require('../utils/validators');

const { getCards, getMyCards, createСard, deleteCard } = require('../controllers/cards');

router.get('/', getCards);
router.get('/my', getMyCards);
router.post('/',  createСard);
router.delete('/:_id', deleteCard);

module.exports = router;
