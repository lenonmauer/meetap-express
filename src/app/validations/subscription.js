const { body } = require('express-validator/check');
const customValidations = require('./custom-validations');

module.exports = [
  body('meetup_id').isString().not().isEmpty().custom(customValidations['object-id']),
];
