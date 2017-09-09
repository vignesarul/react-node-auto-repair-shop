/**
 * Changes the first character of a string to capital letter
 *
 * @param string
 */
const capitalize = string => (string.charAt(0).toUpperCase() + string.slice(1));

/**
 * Converts a valid JSON schema to a valid mongoose schema
 *
 * @param jsonSchema
 * @returns {{}}
 */
module.exports = (jsonSchema) => {
  const schema = {};
  const properties = jsonSchema.properties;
  Object.keys(properties).forEach((key) => {
    schema[key] = {
      type: capitalize((properties[key].type)),
    };
    if (schema[key].type === 'Array') schema[key] = [{ type: 'String' }];
    if ((jsonSchema.required || []).indexOf(key) > -1) schema[key].required = true;
    if ((properties[key]['m-unique'])) {
      schema[key].unique = true;
      schema[key].uniqueCaseInsensitive = true;
    }
    if (properties[key]['m-default']) schema[key].default = properties[key]['m-default'];
  });
  return schema;
};
