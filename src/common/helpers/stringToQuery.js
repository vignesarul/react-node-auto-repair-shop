const _ = require('lodash');
const exceptions = require('common/exceptions');

/**
 * Converts a string in a specific format to mongodb query
 *
 * @param input: (date eq '2016-05-01') AND ((number_of_calories gt 20) OR (number_of_calories lt 10))
 * @returns {{}}
 */
const processQuery = (input) => {
  try {
    let queryString = trimSpaces(input);
    let regEx = /([a-z_]+)( eq | ne | gt | lt )([a-z0-9_@$\-'",\.\\\[\]\{\}\: ]+)/gi;
    const regEx1 = new RegExp(regEx);
    const keys = [];
    let match = regEx1.exec(queryString);
    if (match == null) queryString = '{}';
    else {
      while (match != null) {
        keys.push(match[1]);
        queryString = queryString.replace(match[0], JSON.stringify({ [`${match[1]}`]: { [`$${match[2].replace(/ /g, '')}`]: match[3].replace(/^('|")(.*)('|")$/, '$2') } }));
        const regEx1 = new RegExp(regEx);
        match = regEx1.exec(queryString);
      }

      regEx = /(\([a-z0-9_@$\-'",\.\\\[\]\{\}\: ]+\))( (AND|OR) )(\([a-z0-9_@$\-'",\.\\\[\]\{\}\: ]+\))/gi;
      const regEx2 = new RegExp(regEx);
      match = regEx2.exec(queryString);
      while (match != null) {
        const query = JSON.stringify({ [`$${match[3].toLowerCase()}`]: [JSON.parse(match[1].replace(/^(\()(.*)(\))$/, '$2')), JSON.parse(match[4].replace(/^(\()(.*)(\))$/, '$2'))] });
        queryString = queryString.replace(`(${match[0]})`, match[0]);
        queryString = queryString.replace(match[0], `(${query})`);
        const regEx2 = new RegExp(regEx);
        match = regEx2.exec(queryString);
      }
    }
    return { query: JSON.parse(queryString.replace(/^(\()(.*)(\))$/, '$2')), keys };
  } catch (error) {
    throw new exceptions.InvalidFilterQuery();
  }
};

/**
 * Removes spaces from a filter string
 *
 * @param input
 * @returns {*}
 */
const trimSpaces = (input) => {
  if (typeof input !== 'string') return '';
  let result = _.cloneDeep(input);
  const regEx = [{ regEx: /(\()( )/g, char: '(' }, { regEx: /( )(\))/g, char: ')' }];
  regEx.forEach(reg => (result = result.replace(reg.regEx, reg.char)));
  return result;
};

module.exports = processQuery;
