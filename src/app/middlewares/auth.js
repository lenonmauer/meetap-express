const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const { promisify } = require('util');
const asyncJwtVerify = promisify(jwt.verify);

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await asyncJwtVerify(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  }
  catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
