const Application = require('../models/application');
const User = require('../models/user');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const { ERROR_MESSAGES } = require('../utils/constants');

module.exports.getApplications= (req, res, next) => {

  User.findById(req.params._id)
  .orFail(() => {
    throw new NotFoundError(ERROR_MESSAGES.notFound.messageToDelete);
  })
  .then((user) => {
    if (user.isAdmin === false) {
      throw new ForbiddenError(ERROR_MESSAGES.forbidden.messageToDelete);
    }
  })
  .then(() => {
    Application.find({})
      .then((Applications) => {
        res.send(Applications.reverse());
      })
      .catch(next);
  })
  .catch(next);
};

module.exports.createApplication = (req, res, next) => {
  const { name, description, contacts } = req.body;
  Application.create({
    name,
    description,
    contacts,
  })
    .then((newApplication) => res.send(newApplication))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(ERROR_MESSAGES.badRequest.messageValidate));
      }

      return next(err);
    });
};

module.exports.deleteApplication = (req, res, next) => {
  Application.findByIdAndRemove(req.params._id)
    .then((Application) => {
      if (!Application) {
        throw new NotFoundError(ERROR_MESSAGES.notFound.messageDefault);
      }
      res.send(Application);
    })
    .catch(next);
};
