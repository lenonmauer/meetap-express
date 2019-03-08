const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  meetup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meetup',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
