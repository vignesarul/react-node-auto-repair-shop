const _ = require('lodash');

const tableName = 'users';

const user = {
  phone: { type: 'string', pattern: '^([+][0-9]{1,3}[ ]{1}[0-9]{9,10})$' },
  password: { type: 'string', minLength: 8 },
  firstName: { type: 'string', pattern: '^([a-zA-Z]+)$' },
  lastName: { type: 'string', pattern: '^([a-zA-Z]+)$' },
  email: { type: 'string', format: 'email', 'm-unique': true },
  status: { type: 'string', enum: ['GUEST', 'ACTIVE'] },
  expectedCalories: { type: 'number', 'm-default': 2000 },
  roles: { type: 'string', 'm-default': 'user' },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
  verification: { type: 'object' },
};

const postSchema = {
  type: 'object',
  properties: _.cloneDeep(user),
  required: ['firstName', 'lastName', 'email', 'password'],
};

const updateSchema = {
  type: 'object',
  properties: _.pick(user, ['firstName', 'lastName', 'email', 'expectedCalories', 'phone']),
  anyOf: ['firstName', 'lastName', 'email', 'expectedCalories', 'phone'].map(key => ({ required: [`${key}`] })),
  additionalProperties: false,
};

const updatePasswordSchema = {
  type: 'object',
  properties: { old: { type: 'string', minLength: 8 }, new: { type: 'string', minLength: 8 } },
  required: ['old', 'new'],
  additionalProperties: false,
};

const updateRolesSchema = {
  type: 'object',
  properties: _.pick(user, ['roles']),
  required: ['roles'],
  additionalProperties: false,
};

const resetPasswordSchema = {
  type: 'object',
  properties: _.merge({ code: { type: 'string' } }, _.pick(user, 'email')),
  required: ['email', 'code'],
  additionalProperties: false,
};

const forgotPasswordSchema = {
  type: 'object',
  properties: _.pick(user, ['email']),
  required: ['email'],
  additionalProperties: false,
};

const loginSchema = {
  type: 'object',
  properties: _.pick(user, ['email', 'password']),
  required: ['email', 'password'],
  additionalProperties: false,
};

const querySchema = {
  type: 'object',
  properties: _.omit(user, ['password', 'verification']),
};

module.exports = {
  updateSchema,
  postSchema,
  tableName,
  loginSchema,
  querySchema,
  updatePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateRolesSchema,
};
