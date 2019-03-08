exports.extract = (data, parts) => {
  const newObj = {};

  parts.forEach(key => {
    const value = data[key];
    if (typeof value !== 'undefined') {
      newObj[key] = value;
    }
  });

  return newObj;
};
