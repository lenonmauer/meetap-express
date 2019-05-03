const moment = require('moment');

const Meetup = require('../models/Meetup');
const User = require('../models/User');
const Queue = require('../services/Queue');
const NewSubscriptionMail = require('../jobs/NewSubscriptionMail');

class SubscriptionController {
  async store (req, res) {
    const meetup = await Meetup.findOneAndUpdate(
      {
        _id: req.body.meetup_id,
        subscriptions: {
          $ne: req.userId,
        },
      },
      { $push: { subscriptions: req.userId } },
      { new: true }
    );

    if (meetup) {
      const user = await User.findById(req.userId);

      Queue.create(NewSubscriptionMail.key, {
        email: user.email,
        name: user.name,
        title: meetup.title,
        date: moment(meetup.date).format('DD/MM/YYYY HH:mm'),
      }).save();
    }

    return res.json(meetup);
  }
}

module.exports = new SubscriptionController();
