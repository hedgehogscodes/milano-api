const jwt = require('jsonwebtoken');
const UnauthError = require('../utils/errors/UnauthError');
const { JWT_DEV_SECRET, ERROR_MESSAGES } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;
const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthError(ERROR_MESSAGES.unauthError.messageAuth));
  }

  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(
      token,
      `${NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET}`,
    );
  } catch (err) {
    next(new UnauthError(ERROR_MESSAGES.unauthError.messageAuth));
  }

  req.user = payload;
  return next();
};
