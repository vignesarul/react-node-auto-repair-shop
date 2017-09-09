import test from 'ava';
import jsf from 'json-schema-faker';
import Connection from 'common/database/connection';
import Access from 'models/access';
import config from 'common/config/config';
import schema from 'schema/access';
import mongooseSchema from 'common/helpers/mongooseSchema';
import _ from 'lodash';

let dbConnection;
let access;
const mockData = jsf(schema.postSchema);
const userSchema = mongooseSchema(schema.postSchema);
let accessId;
let accessToken;

test.before.cb('it creates a new database connection', (t) => {
  dbConnection = new Connection(config.database);
  dbConnection.connect().then(() => {
    t.truthy(dbConnection.isConnected());
    access = new Access({
      db: dbConnection.db,
      schema: userSchema,
      tableName: schema.tableName,
      signature: config.secret.jwtSignature,
    });
    t.end();
  });
});

test.cb('it creates a new access log', (t) => {
  access.createAccessLog(mockData).then((data) => {
    t.truthy(data.id);
    accessId = data.id;
    t.end();
  });
});

test.cb('it updates an access log', (t) => {
  const expiresAt = new Date().toISOString();
  access.updateAccessLog(accessId, { expiresAt }).then((data) => {
    t.is(data.expiresAt, expiresAt);
    t.end();
  });
});

test.cb('it gets an access log', (t) => {
  access.getAccessLog(accessId).then((data) => {
    t.is(data.id, accessId);
    t.end();
  });
});

test.cb('it queries for an accesslog', (t) => {
  access.queryAccessLog(_.pick(mockData, 'userId')).then((data) => {
    t.is(data[0].id, accessId);
    t.end();
  });
});

test.cb('it creates a jwt token', (t) => {
  access.createJwtToken(_.merge(_.pick(mockData, 'userId')), { _id: '1234567890' }).then((data) => {
    t.truthy(data.access_token);
    accessToken = data.access_token;
    t.end();
  });
});

test.cb('it validates a jwt token', (t) => {
  access.verifyToken(accessToken).then((data) => {
    t.truthy(data.userId);
    t.end();
  });
});
