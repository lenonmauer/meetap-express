const { body } = require('express-validator/check');

module.exports = [
  body('email')
    .isString()
    .not().isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .isString()
    .isLength({ min: 6 })
    .withMessage('Password length must be >= 6'),
];
