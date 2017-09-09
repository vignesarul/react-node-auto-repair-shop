const _ = require('lodash');

const tableName = 'repairs';

const repair = {
  userId: { type: 'string' },
  title: { type: 'string', minLength: 2, maxlength: 150 },
  completed: { type: 'boolean', 'm-default': false },
  approved: { type: 'boolean', 'm-default': false },
  date: { type: 'string', pattern: '^(19|20)\\d\\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$' },
  time: { type: 'string', pattern: '^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$' },
  createdBy: { type: 'string' },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};

const postSchema = {
  type: 'object',
  properties: _.omit(repair, 'id'),
  required: ['title'],
};

const updateSchema = {
  type: 'object',
  properties: _.pick(repair, ['userId', 'completed', 'approved', 'title', 'date', 'time']),
  anyOf: ['userId', 'completed', 'approved', 'title', 'date', 'time'].map(key => ({ required: [`${key}`] })),
  additionalProperties: false,
};

const querySchema = {
  type: 'object',
  properties: _.omit(repair, ['userId']),
};

module.exports = {
  postSchema,
  updateSchema,
  tableName,
  querySchema,
};
