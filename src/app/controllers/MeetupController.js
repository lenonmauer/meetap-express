const moment = require('moment');

const Meetup = require('../models/Meetup');
const User = require('../models/User');
const { extract } = require('../helpers/functions');

class MeetupController {
  async index (req, res) {
    const search = req.query.search || '';
    const now = moment().format('YYYY-MM-DD HH:mm');
    const user = await User.findById(req.userId);

    const subscriptions = await Meetup.find({
      title: new RegExp(search, 'i'),
      date: {
        $gt: now,
      },
      subscriptions: req.userId,
    })
      .sort({ date: 1 })
      .limit(6);

    const subscriptionsId = subscriptions.map((subscription) => subscription.id);

    const next = await Meetup.find({
      title: new RegExp(search, 'i'),
      date: {
        $gt: now,
      },
      _id: {
        $nin: subscriptionsId,
      },
    }).sort({ date: 1 });

    const recommended = await Meetup.find({
      title: new RegExp(search, 'i'),
      date: {
        $gt: now,
      },
      _id: {
        $nin: subscriptionsId,
      },
      categories: {
        $in: user.categories,
      },
    }).sort({ date: 1 });

    return res.json({
      subscriptions,
      next,
      recommended,
    });
  }

  async show (req, res) {
    const meetup = await Meetup.findOne({ _id: req.params.id });

    const subscript = meetup.subscriptions.indexOf(req.userId) >= 0;

    return res.json({
      ...meetup.toJSON(),
      subscript,
    });
  }

  async store (req, res) {
    const data = extract(req.body, ['title', 'description', 'date', 'photo', 'localization', 'categories']);

    const now = moment().format('x');
    const dateInMilis = moment(data.date, 'DD/MM/YYYY HH:mm').format('x');

    if (Number(dateInMilis) < Number(now)) {
      return res.status(400).send({
        error: 'O campo data dever ser maior que a data de hoje.',
      });
    }

    const formattedData = {
      ...data,
      date: moment(dateInMilis, 'x').format('YYYY-MM-DD HH:mm:ss'),
      user: req.userId,
    };

    const meetup = await Meetup.create(formattedData);

    return res.json(meetup);
  }
}

module.exports = new MeetupController();
