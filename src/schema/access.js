const _ = require('lodash');

const tableName = 'access';

const access = {
  userId: { type: 'string' },
  expiresAt: { type: 'string' },
};

const postSchema = {
  type: 'object',
  properties: _.cloneDeep(access),
  required: ['userId', 'expiresAt'],
};

module.exports = {
  postSchema,
  tableName,
};
