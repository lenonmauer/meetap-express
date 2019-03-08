const { validationResult } = require('express-validator/check');

const User = require('../models/User');
const { extract } = require('../helpers/functions');

class UserCategoryController {
  async update (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { userId } = req;
    const data = extract(req.body, ['categories']);

    const result = await User.findOneAndUpdate({ _id: userId }, data, { new: true });

    const { name, categories } = result;

    return res.json({
      name,
      categories,
    });
  }
}

module.exports = new UserCategoryController();
