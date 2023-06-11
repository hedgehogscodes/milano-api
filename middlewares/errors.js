const { ERROR_MESSAGES } = require('../utils/constants');

const handleErrors = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? ERROR_MESSAGES.default.message : message,
  });
  next();
};

module.exports = handleErrors;
