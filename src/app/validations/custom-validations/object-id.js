const mongoose = require('mongoose');

module.exports = (value) => {
  const result = mongoose.Types.ObjectId.isValid(value);

  return result;
};
