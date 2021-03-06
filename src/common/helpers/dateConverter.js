const moment = require('moment');

/**
 * Adds days to a date string and returns in any given format
 *
 * @param input
 * @returns 'string'
 */
const addDays = input => moment(input.date).add(input.count, 'days').format(input.format || 'YYYY-MM-DD');

/**
 * Adds 1 hour time to a date-time string
 *
 * @param input
 * @returns 'string'
 */
const addTime = (input) => {
  const momentTime = moment(`${input.date} ${input.time}`).add(input.count, 'hour');
  return ({
    date: momentTime.format('YYYY-MM-DD'),
    time: momentTime.format('HH:mm:ss'),
  });
};

/**
 * Adds days to a current date and returns in ISO date format
 *
 * @param amount
 * @param format
 * @returns 'string'
 */
const addTimeIso = (amount, format) => moment().add(amount, format).toISOString();

/**
 * returns a random number of any given size less than 10^20
 *
 * @param size
 * @returns {Number}
 */
const getRandomNumber = (size) => {
  let multipler = 1;
  for (let i = 0; i < size; i += 1) {
    multipler *= 10;
  }
  const result = parseInt(Math.random() * multipler, 10);
  if ((`${result}`).length !== size) return getRandomNumber(size);
  return result;
};

module.exports = {
  addDays,
  addTime,
  addTimeIso,
  getRandomNumber,
};
