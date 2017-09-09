const PasswordMismatch = require('common/exceptions/passwordMismatch.error');
const NotFound = require('common/exceptions/notFound.error');
const UnAuthorized = require('common/exceptions/unAuthorized.error');
const InvalidInput = require('common/exceptions/invalidInput.error');
const UserNotActive = require('common/exceptions/userNotActive.error');
const Forbidden = require('common/exceptions/forbidden.error');
const DuplicateRecord = require('common/exceptions/duplicate.error');
const InvalidFilterQuery = require('common/exceptions/invalidFilterQuery.error.js');

module.exports = {
  UserNotActive,
  Forbidden,
  InvalidInput,
  UnAuthorized,
  NotFound,
  PasswordMismatch,
  DuplicateRecord,
  InvalidFilterQuery,
};
