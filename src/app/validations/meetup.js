const { body } = require('express-validator/check');
const customValidations = require('./custom-validations');

module.exports = [
  body('title').isString().not().isEmpty(),
  body('description').isString().not().isEmpty(),
  body('photo_id').isString().not().isEmpty().custom(customValidations['object-id']),
  body('localization').isString().not().isEmpty(),
  body('date').isString().not().isEmpty().custom(customValidations['datetime-br']),
  body('categories').isArray().not().isEmpty(),
  body('categories.*').isString().isIn(['front-end', 'back-end', 'mobile', 'dev-ops', 'gestao', 'marketing']),
];
