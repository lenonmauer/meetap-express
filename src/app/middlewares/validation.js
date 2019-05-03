const { validationResult } = require('express-validator/check');
const { promisify } = require('util');

module.exports = (expressValidations) => async (req, res, next) => {
  const validationPromises = await expressValidations.map((validation) => promisify(validation)(req, res));

  await Promise.all(validationPromises);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  next();
};
