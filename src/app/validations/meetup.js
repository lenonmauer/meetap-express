const { body } = require('express-validator/check');
const customValidations = require('./custom-validations');

module.exports = [
  body('title')
    .isString()
    .not().isEmpty(),
  body('description')
    .isString()
    .not().isEmpty(),
  body('photo')
    .isString()
    .not().isEmpty()
    .custom(customValidations['object-id'])
    .withMessage('Invalid Photo'),
  body('localization')
    .isString()
    .not().isEmpty(),
  body('date')
    .isString()
    .not().isEmpty()
    .custom(customValidations['datetime-br'])
    .withMessage('Invalid Date'),
  body('categories')
    .isArray()
    .not().isEmpty(),
  body('categories.*')
    .isString()
    .isIn(['front-end', 'back-end', 'mobile', 'dev-ops', 'gestao', 'marketing']),
];
