module.exports = (value) => isDate(value);

const isDate = (value) => {
  value = value || '';

  const [day, month, year] = value.split('/');
  const result = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/) && checkDate(day, month, year);

  return result;
};

const checkDate = (d, m, y) => {
  const lastDayOfMonth = new Date(y, m, 0).getDate();
  const minYear = 1800;
  const maxYear = 3000;
  const minMonth = 1;
  const maxMonth = 12;
  const minDay = 1;

  return (
    between(m, minMonth, maxMonth) &&
    between(y, minYear, maxYear) &&
    between(d, minDay, lastDayOfMonth)
  );
};

const between = (value, n1, n2) => {
  return value >= Math.min(n1, n2) && value <= Math.max(n1, n2);
};
