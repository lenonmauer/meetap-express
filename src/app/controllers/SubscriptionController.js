const { validationResult } = require('express-validator/check');

const Meetup = require('../models/Meetup');

class SubscriptionController {
  async store (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const meetup = await Meetup.findOneAndUpdate(
      {
        _id: req.body.meetup_id,
        subscriptions: {
          $ne: req.userId,
        },
      },
      { $push: { subscriptions: req.userId } },
    );

    if (meetup) {
      // trigger email
    }

    return res.json(meetup);
  }
}

module.exports = new SubscriptionController();
