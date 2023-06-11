const Saved = require('../models/saved');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const { ERROR_MESSAGES } = require('../utils/constants');

module.exports.getSaved = (req, res, next) => {
  Saved.find({ owner: req.user._id })
    .populate({
      path: 'card',
      populate: { path: 'master' }
    })
    .populate({
      path: 'card',
      populate: { path: 'owner' }
    })
    .then((saved) => res.send(saved))
    .catch(next);
};

module.exports.createSave = (req, res, next) => {
  const { card } = req.body;
  Saved.create({
    owner: req.user._id,
    card
  })
    .then((newSave) => res.send(newSave))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(ERROR_MESSAGES.badRequest.messageValidate));
      }

      return next(err);
    });
};

module.exports.deleteSave = (req, res, next) => {
  Saved.findById(req.params._id)
    .select('+owner')
    .orFail(() => {
      throw new NotFoundError(ERROR_MESSAGES.notFound.messageToDelete);
    })
    .then((save) => {
      if (save.owner.toString() !== req.user._id) {
        throw new ForbiddenError(ERROR_MESSAGES.forbidden.messageToDelete);
      }
    })
    .then(() => {
      Saved.findByIdAndRemove(req.params._id)
        .then((save) => {
          if (!save) {
            throw new NotFoundError(ERROR_MESSAGES.notFound.messageDefault);
          }
          res.send(save);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.deleteAllSave = (req, res, next) => {
  Saved.deleteMany({card: req.params._id})
    .then((deleteCards) => {
      if (!deleteCards) {
        throw new NotFoundError(ERROR_MESSAGES.notFound.messageDefault);
      }
      res.send(deleteCards);
    })
    .catch(next);
};