const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

module.exports.validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi
      .string()
      .required()
      .custom((value, helpers) => {
        if (isURL(value, { require_protocol: true })) {
          return value;
        }

        return helpers.error('Передан некорректный URL-адрес');
      }),
    trailerLink: Joi
      .string()
      .required()
      .custom((value, helpers) => {
        if (isURL(value, { require_protocol: true })) {
          return value;
        }

        return helpers.error('Передан некорректный URL-адрес');
      }),
    thumbnail: Joi
      .string()
      .required()
      .custom((value, helpers) => {
        if (isURL(value, { require_protocol: true })) {
          return value;
        }

        return helpers.error('Передан некорректный URL-адрес');
      }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports.validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
});
