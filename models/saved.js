const mongoose = require('mongoose');

const savedSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  card: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'card',
  },
});

module.exports = mongoose.model('saved', savedSchema);
