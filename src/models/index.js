const config = require('common/config/config');
const mongooseSchema = require('common/helpers/mongooseSchema');

const User = require('models/user');
const userSchema = require('schema/user');
const Access = require('models/access');
const accessSchema = require('schema/access');
const Role = require('models/role');
const roleSchema = require('schema/role');
const Repair = require('models/repair');
const repairSchema = require('schema/repair');

module.exports = db => ({
  user: new User({
    db,
    schema: mongooseSchema(userSchema.postSchema),
    tableName: userSchema.tableName,
    salt: config.secret.passwordSalt,
    jsonSchema: userSchema,
  }),
  access: new Access({
    db,
    schema: mongooseSchema(accessSchema.postSchema),
    tableName: accessSchema.tableName,
    signature: config.secret.jwtSignature,
    jsonSchema: accessSchema,
  }),
  role: new Role({
    db,
    schema: mongooseSchema(roleSchema.postSchema),
    tableName: roleSchema.tableName,
    jsonSchema: roleSchema,
  }),
  repair: new Repair({
    db,
    schema: mongooseSchema(repairSchema.postSchema),
    tableName: repairSchema.tableName,
    jsonSchema: repairSchema,
  }),
});
