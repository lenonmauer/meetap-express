const { validationResult } = require('express-validator/check');

const User = require('../models/User');

class SessionController {
  async store (req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (!await user.compareHash(password)) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = user.generateToken(user);
    const { first_login } = user;

    return res.json({ first_login, token });
  }
}

module.exports = new SessionController();
