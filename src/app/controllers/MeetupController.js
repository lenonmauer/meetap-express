const moment = require('moment');
const { validationResult } = require('express-validator/check');

const Meetup = require('../models/Meetup');
const { extract } = require('../helpers/functions');

class MeetupController {
  async index (req, res) {
    return res.send('ok');
  }

  async show (req, res) {
    const meetup = await Meetup.findOne({ _id: req.params.id });

    const subscript = meetup.categories.includes(req.userId);
    const members_count = meetup.subscriptions.length;

    const data = extract(meetup.toJSON(), ['_id', 'title', 'description', 'localization', 'date']);

    return res.json({
      ...data,
      subscript,
      members_count,
    });
  }

  async store (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const data = extract(req.body, ['title', 'description', 'date', 'photo', 'localization', 'categories']);

    const now = moment().format('x');
    const dateInMilis = moment(data.date, 'DD/MM/YYYY H:m').format('x');

    if (Number(dateInMilis) < Number(now)) {
      return res.status(400).send([
        {
          error: 'O campo data dever ser maior que a data de hoje.',
        },
      ]);
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
