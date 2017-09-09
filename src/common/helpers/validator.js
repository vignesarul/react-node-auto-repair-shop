const Promise = require('bluebird');
const JsonSchema = require('jsonschema').Validator;
const exceptions = require('common/exceptions');
const _ = require('lodash');

const jsonValidate = new JsonSchema();

/**
 * Creates a object that matches the properties of JSON schema from original object given
 *
 * @param input
 * @param schema
 * @returns {{}}
 */
const buildParams = ({ input, schema }) => new Promise((resolve) => {
  resolve(_.pick(input, _.intersection(_.keys(schema.properties), _.keys(input))));
});

/**
 * Validates the json and its content against the given schema.
 * Throws error if mismatch occurs
 *
 * @param input
 * @param schemaName
 */
const validate = ({ input, schema }) => new Promise((resolve, reject) => {
  const result = jsonValidate.validate(input, schema);
  if (result.errors && result.errors.length > 0) {
    reject(new exceptions.InvalidInput(result.errors));
  }
  resolve(input);
});

module.exports = {
  validate,
  buildParams,
};
