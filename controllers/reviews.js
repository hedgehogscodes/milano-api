const Review = require('../models/review');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const { ERROR_MESSAGES } = require('../utils/constants');

module.exports.getReviews = (req, res, next) => {
  Review.find({})
    .populate('owner')
    .then((reviews) => {
      res.send(reviews.reverse());
    })
    .catch(next);
};

module.exports.createReview = (req, res, next) => {
  const { description, createdAt } = req.body;
  Review.create({
    description,
    owner: req.user._id,
    createdAt
  })
    .then((newReview) => res.send(newReview))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(ERROR_MESSAGES.badRequest.messageValidate));
      }

      return next(err);
    });
};

module.exports.deleteReview = (req, res, next) => {
  Review.findByIdAndRemove(req.params._id)
    .then((review) => {
      if (!note) {
        throw new NotFoundError(ERROR_MESSAGES.notFound.messageDefault);
      }
      res.send(review);
    })
    .catch(next);
};
