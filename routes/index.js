const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const savedRouter = require('./saved');
const notesRouter = require('./notes');
const reviewsRouter = require('./reviews');
const applicationsRouter = require('./applications');
const auth = require('../middlewares/auth');
const { login, createUser, getMasters } = require('../controllers/users');
const { getReviews } = require('../controllers/reviews');
const NotFoundError = require('../utils/errors/NotFoundError');
const { validateCreateUser, validateLogin } = require('../utils/validators');
const { ERROR_MESSAGES } = require('../utils/constants');

router.post('/signup', createUser);
router.post('/signin',  login);
router.get('/masters', getMasters);
router.get('/review', getReviews);
router.use('/applications', applicationsRouter);
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/saved', savedRouter);
router.use('/notes', notesRouter);
router.use('/reviews', reviewsRouter);
router.use('/*', () => {
  throw new NotFoundError(ERROR_MESSAGES.notFound.messageDefault);
});

module.exports = router;
