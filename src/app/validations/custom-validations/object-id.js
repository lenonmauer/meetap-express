const mongoose = require('mongoose');

module.exports = (value, { req }) => {
  const result = mongoose.Types.ObjectId.isValid(value);

  if (!result) {
    throw new Error('Invalid ObjectId');
  }

  return result;
};
