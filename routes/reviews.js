const router = require('express').Router();

const { createReview, deleteReview } = require('../controllers/reviews');

router.post('/',  createReview);
router.delete('/:_id', deleteReview);

module.exports = router;
