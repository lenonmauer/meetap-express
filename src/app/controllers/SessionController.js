const { validationResult } = require('express-validator/check');

const User = require('../models/User');

class SessionController {
  async store (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'E-mail não encontrado' });
    }

    if (!await user.compareHash(password)) {
      return res.status(400).json({ error: 'Senha inválida' });
    }

    const token = user.generateToken(user);
    const { first_login } = user;

    return res.json({ first_login, token });
  }
}

module.exports = new SessionController();
