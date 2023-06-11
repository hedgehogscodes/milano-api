const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const UnauthError = require('../utils/errors/UnauthError');
const UniqueError = require('../utils/errors/UniqueError');

const { JWT_DEV_SECRET, ERROR_MESSAGES } = require('../utils/constants');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt
    .hash(password.toString(), 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((newUser) => {
      res.send({
        name: newUser.name,
        email: newUser.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new UniqueError(ERROR_MESSAGES.uniqueError.messageUniqueMail));
      }

      if (err.name === 'ValidationError') {
        return next(new BadRequestError(ERROR_MESSAGES.badRequest.messageValidate));
      }

      return next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(ERROR_MESSAGES.notFound.messageUser))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new UnauthError(ERROR_MESSAGES.unauthError.messageObjectId));
      }

      return next(err);
    });
};

module.exports.getMasters = (req, res, next) => {
  User.find({ isMaster: true })
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, password } = req.body;
  bcrypt
    .hash(password.toString(), 10)
    .then((hash) => {
      User.findByIdAndUpdate(
        req.user._id, 
        { 
          email, 
          password: hash,
        }, 
        { 
          new: true, 
          runValidators: true 
        }
      )
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.code === 11000) {
          return next(new UniqueError(ERROR_MESSAGES.uniqueError.messageUniqueMail));
        }
        if (err.name === 'CastError') {
          return next(new NotFoundError(ERROR_MESSAGES.notFound.messageUser));
        }

        if (err.name === 'ValidationError') {
          return next(new BadRequestError(ERROR_MESSAGES.badRequest.messageValidate));
        }

        return next(err);
      });
    })
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError("Нет пользователя с таким id"))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("Ошибка валидации. Введены некорректные данные"),
        );
      } else {
        next(err);
      }
    });
};

module.exports.updateBio = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError("Нет пользователя с таким id"))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("Ошибка валидации. Введены некорректные данные"),
        );
      } else {
        next(err);
      }
    });
};

module.exports.updateStatus = (req, res, next) => {
  const { email, isMaster, isAdmin } = req.body;
  User.findOneAndUpdate( { email } , { isMaster, isAdmin }, { new: true, runValidators: true })
    .orFail(new NotFoundError("Нет пользователя с таким id"))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("Ошибка валидации. Введены некорректные данные"),
        );
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthError(ERROR_MESSAGES.unauthError.messageFail);
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};
