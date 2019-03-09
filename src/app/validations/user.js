const { body } = require('express-validator/check');
const customValidations = require('./custom-validations');

module.exports = {
  store: [
    body('name')
      .isString()
      .not().isEmpty(),
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
    body('password_confirmation')
      .custom(customValidations['match-password']('password')),
  ],
  update: [
    body('name')
      .isString().not()
      .isEmpty()
      .withMessage('Name is required'),
    body('password')
      .isString()
      .isLength({ min: 6 })
      .withMessage('Password length must be >= 6'),
    body('password_confirmation')
      .custom(customValidations['match-password']('password')),
    body('categories')
      .isArray()
      .not().isEmpty()
      .withMessage('Categories must be an array'),
    body('categories.*')
      .isString()
      .isIn(['front-end', 'back-end', 'mobile', 'dev-ops', 'gestao', 'marketing'])
      .withMessage('Invalid category'),
  ],
};
