const mongoose = require('mongoose');
const { isURL } = require('validator');

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
  },
  contacts: {
    type: String,
    required: true,
    minlength: 2,
  },
});

module.exports = mongoose.model('application', applicationSchema);
