const Note = require('../models/note');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const { ERROR_MESSAGES } = require('../utils/constants');

module.exports.getNotesByMasterId = (req, res, next) => {
  const master = req.params.id;
  Note.find({ master: master }).select({ "start_date": 1, "end_date": 1, "id": 1, "text": 1, "_id": 0})
    .then((movies) => res.send(movies.reverse()))
    .catch(next);
};

module.exports.createNote = (req, res, next) => {
  const { start_date, end_date, id, master, text } = req.body;
  Note.create({
    start_date,
    end_date,
    id,
    master,
    text
  })
    .then((newNote) => res.send(newNote))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(ERROR_MESSAGES.badRequest.messageValidate));
      }

      return next(err);
    });
};

module.exports.updateNote = (req, res, next) => {
  const { start_date, end_date, id, text } = req.body;
  Note.findOneAndUpdate({ id: id }, { start_date, end_date, text }, { new: true, runValidators: true })
    .orFail(new NotFoundError("Нет такой записи"))
    .then((note) => {
      res.send(note);
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

module.exports.deleteNote = (req, res, next) => {
  Note.findOneAndRemove({ id: req.params.id })
    .then((note) => {
      if (!note) {
        throw new NotFoundError(ERROR_MESSAGES.notFound.messageDefault);
      }
      res.send(note);
    })
    .catch(next);
};
