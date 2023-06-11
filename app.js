const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');

const router = require('./routes/index');
const handleErrors = require('./middlewares/errors');
const requestLimiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_DEV_URL } = require('./utils/constants');

const { MONGO_URL = MONGO_DEV_URL, PORT = 3000 } = process.env;

const app = express();

mongoose.connect( MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(express.json());

app.use(requestLogger);
app.use(requestLimiter);
app.use(cors());
app.use(helmet());

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(handleErrors);

app.listen(PORT, (err) => {
  if (err) {
    console.log('Error in server setup');
  } else {
    console.log(`Server listening on port ${PORT}`);
  }
});
