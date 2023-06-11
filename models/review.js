const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
  },
  createdAt: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('review', reviewSchema);
