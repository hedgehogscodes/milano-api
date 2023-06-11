const Card = require('../models/card');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const { ERROR_MESSAGES } = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .populate('master')
    .then((cards) => {
      res.send(cards.reverse());
    })
    .catch(next);
};

module.exports.getMyCards = (req, res, next) => {
  Card.find({ owner: req.user._id })
    .populate('master')
    .then((movies) => res.send(movies.reverse()))
    .catch(next);
};

module.exports.createСard = (req, res, next) => {
  const { name, link, master } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
    master
  })
    .then((newCard) => res.send(newCard))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(ERROR_MESSAGES.badRequest.messageValidate));
      }

      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params._id)
    .select('+owner')
    .orFail(() => {
      throw new NotFoundError(ERROR_MESSAGES.notFound.messageToDelete);
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError(ERROR_MESSAGES.forbidden.messageToDelete);
      }
    })
    .then(() => {
      Card.findByIdAndRemove(req.params._id)
        .then((card) => {
          if (!card) {
            throw new NotFoundError(ERROR_MESSAGES.notFound.messageDefault);
          }
          res.send(card);
        })
        .catch(next);
    })
    .catch(next);
};
