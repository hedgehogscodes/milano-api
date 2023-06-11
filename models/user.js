const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail, isURL } = require('validator');
const UnauthError = require('../utils/errors/UnauthError');
const { ERROR_MESSAGES } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Пользователь Милано",
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return isURL(v, { require_protocol: true });
      },
      message: "Неверная ссылка!",
    },
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  isMaster: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthError(ERROR_MESSAGES.unauthError.messagePassOrLogin));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthError(ERROR_MESSAGES.unauthError.messagePassOrLogin));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
