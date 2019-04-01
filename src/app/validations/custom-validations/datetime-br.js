module.exports = (value) => isDateTimeBR(value);

const isDateTimeBR = (value) => {
  const [date, time] = value.split(' ');

  return isFormatCorrect(value) && isDateBR(date) && isTime(time);
};

const isDateBR = (value) => {
  const [day, month, year] = value.split('/');

  return checkDate(day, month, year);
};

const isTime = (value) => {
  const [hour, minutes] = value.split(':').map(Number);

  return hour < 24 && minutes < 60;
};

const isFormatCorrect = (value) => !!value.match(/^\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}$/);

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
