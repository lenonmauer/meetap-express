const { body } = require('express-validator/check');

module.exports = [
  body('categories')
    .not().isEmpty()
    .isArray()
    .withMessage('Categories must be an array'),
  body('categories.*')
    .isString()
    .isIn(['front-end', 'back-end', 'mobile', 'dev-ops', 'gestao', 'marketing'])
    .withMessage('Invalid category'),
];
