module.exports = (matchField) => (value, { req }) => {
  const result = value === req.body[matchField];

  return result;
};
