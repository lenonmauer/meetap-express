const { validationResult } = require('express-validator/check');

const User = require('../models/User');
const { extract } = require('../helpers/functions');

class UserController {
  async show (req, res, next) {
    const user = await User.findOne({ _id: req.userId });

    const { categories, name } = user;

    return res.json({
      categories,
      name,
    });
  }

  async store (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const data = extract(req.body, ['email', 'password', 'name']);
    const { email } = data;

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Este e-mail já existe!' });
    }

    const result = await User.create(data);

    return res.json(result);
  }

  async update (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { userId } = req;
    const data = extract(req.body, ['name', 'password', 'categories']);

    const result = await User.findOneAndUpdate({ _id: userId }, data, { new: true });

    const { name, categories } = result;

    return res.json({
      name,
      categories,
    });
  }
}

module.exports = new UserController();
