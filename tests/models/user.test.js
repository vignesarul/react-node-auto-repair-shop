import test from 'ava';
import jsf from 'json-schema-faker';
import Connection from 'common/database/connection';
import User from 'models/user';
import config from 'common/config/config';
import schema from 'schema/user';
import mongooseSchema from 'common/helpers/mongooseSchema';
import _ from 'lodash';

let dbConnection;
let user;
const mockData = jsf(schema.postSchema);
const userSchema = mongooseSchema(schema.postSchema);
let userId;
let userHashPassword;

test.before.cb('it creates a new database connection', (t) => {
  dbConnection = new Connection(config.database);
  dbConnection.connect().then(() => {
    t.truthy(dbConnection.isConnected());
    user = new User({
      db: dbConnection.db,
      schema: userSchema,
      tableName: schema.tableName,
      salt: config.secret.passwordSalt,
    });
    t.end();
  });
});

test.cb('it creates a new user', (t) => {
  user.createUser(_.omit(mockData, 'phone')).then((data) => {
    t.truthy(data.id);
    userId = data.id;
    t.end();
  });
});

test.cb('it updates an user', (t) => {
  const newPhone = '+12 1234567890';
  user.updateUser(userId, { phone: newPhone }).then((data) => {
    t.is(data.phone, newPhone);
    t.end();
  });
});

test.cb('it gets an user', (t) => {
  user.getUser(userId).then((data) => {
    t.is(data.id, userId);
    t.end();
  });
});

test.cb('it queries an user', (t) => {
  user.queryUser(_.pick(mockData, 'firstName')).then((data) => {
    t.is(data[0].id, userId);
    t.end();
  });
});

test.cb('it encrypts password', (t) => {
  userHashPassword = user.encryptPasswordString('123');
  t.truthy(userHashPassword);
  t.end();
});

test.cb('it compares and verify the password', (t) => {
  const verifyPassword = user.verifyPassword('123', userHashPassword);
  t.truthy(verifyPassword);
  t.end();
});

test.cb('it verifies login credentials', (t) => {
  user.verifyLogin(mockData.email, mockData.password).catch((err) => {
    t.is(err.message, 'User Not Active');
    t.end();
  });
});

test.cb('it deletes an user', (t) => {
  user.deleteUser(userId).then((data) => {
    t.is(data.id, userId);
    t.end();
  });
});
