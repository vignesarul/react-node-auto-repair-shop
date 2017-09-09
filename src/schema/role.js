const _ = require('lodash');

const tableName = 'roles';

const role = {
  name: { type: 'string', pattern: '^([a-zA-Z0-9\-]{2,25})$', 'm-unique': true },
  permissions: {
    type: 'array',
    items: {
      type: 'string',
      minLength: 1,
      pattern: '^(_\\.){0,1}([a-z]{1,10})([.])([a-z]{1,10})$'
    }
  },
  level: { type: 'number', minimum: 1, maximum: 10 },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};

const postSchema = {
  type: 'object',
  properties: _.omit(role, 'id'),
  required: ['name', 'permissions', 'level'],
};

module.exports = {
  postSchema,
  tableName,
};
