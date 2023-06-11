const MONGO_DEV_URL = 'mongodb://localhost:27017/moviesdb';
const JWT_DEV_SECRET = 'dev-secret';

const ERROR_MESSAGES = {
  unauthError: {
    messageAuth: 'Необходимо авторизироваться',
    messageFail: 'Авторизация не пройдена!',
    messageObjectId: 'Неверно введен id',
    messagePassOrLogin: 'Неправильные почта или пароль',
  },
  badRequest: {
    messageValidate: 'Ошибка валидации. Введены некорректные данные',
  },
  notFound: {
    messageDefault: 'Запрашиваемый ресурс не найден',
    messageToDelete: 'Фильм с таким id не существует, невозможно удалить!',
    messageUser: 'Нет пользователя с таким id',
  },
  forbidden: {
    messageToDelete: 'Нельзя удалить чужой фильм!',
  },
  uniqueError: {
    messageUniqueMail: 'Данный email уже зарегистрирован',
  },
  default: {
    message: 'На сервера произошла ошибка',
  },
};

module.exports = {
  MONGO_DEV_URL, JWT_DEV_SECRET, ERROR_MESSAGES,
};
