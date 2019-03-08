const mongoose = require('mongoose');

const MeetupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  localization: {
    type: String,
    required: true,
  },
  categories: [
    {
      type: String,
      enum: ['front-end', 'back-end', 'mobile', 'dev-ops', 'gestao', 'marketing'],
    },
  ],
  subscriptions: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
  }],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Meetup', MeetupSchema);
