module.exports = (matchField) => (value, { req }) => {
  const result = value === req.body[matchField];

  if (!result) {
    throw new Error('Password does not match');
  }

  return result;
};
