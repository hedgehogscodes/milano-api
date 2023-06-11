const mongoose = require('mongoose');
const { isURL } = require('validator');

const noteSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  start_date: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  end_date: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  master: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  text: {
    type: String,
    required: true,
    minlength: 2,
  },
});

module.exports = mongoose.model('note', noteSchema);
