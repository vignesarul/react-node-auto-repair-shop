const _ = require('lodash');

const tableName = 'meals';

const meal = {
  userId: { type: 'string' },
  text: { type: 'string', minLength: 2, maxlength: 150 },
  calories: { type: 'number', minimum: 0 },
  dailyGoal: { type: 'boolean', 'm-default': true },
  date: { type: 'string', pattern: '^(19|20)\\d\\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$' },
  time: { type: 'string', pattern: '^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$' },
  autoFetch: { type: 'boolean', 'm-default': false },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};

const postSchema = {
  type: 'object',
  properties: _.omit(meal, 'id'),
  required: ['userId', 'text', 'date', 'time'],
};

const updateSchema = {
  type: 'object',
  properties: _.pick(meal, ['userId', 'calories', 'text', 'date', 'time']),
  anyOf: ['calories', 'text', 'date', 'time'].map(key => ({ required: [`${key}`] })),
  additionalProperties: false,
};

const querySchema = {
  type: 'object',
  properties: _.omit(meal, ['userId']),
};

module.exports = {
  postSchema,
  updateSchema,
  tableName,
  querySchema,
};
