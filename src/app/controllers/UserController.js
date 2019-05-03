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
    const data = extract(req.body, ['email', 'password', 'name']);
    const { email } = data;

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Este e-mail já existe!' });
    }

    const result = await User.create(data);

    return res.json(result);
  }

  async update (req, res, next) {
    const user = await User.findOne({ _id: req.userId });
    const data = extract(req.body, ['name', 'password', 'categories']);

    Object.assign(user, data);

    await user.save();

    const { name, categories } = user;

    return res.json({
      name,
      categories,
    });
  }
}

module.exports = new UserController();
