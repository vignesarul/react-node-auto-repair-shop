import test from 'ava';
import Connection from 'common/database/connection';
import Role from 'models/role';
import config from 'common/config/config';
import schema from 'schema/role';
import mongooseSchema from 'common/helpers/mongooseSchema';

const rolesSchema = mongooseSchema(schema.postSchema);
let dbConnection;
let role;

test.before.cb('it creates a new database connection', (t) => {
  dbConnection = new Connection(config.database);
  dbConnection.connect().then(() => {
    t.truthy(dbConnection.isConnected());
    role = new Role({
      db: dbConnection.db,
      schema: rolesSchema,
      tableName: schema.tableName,
    });
    t.end();
  });
});

test.cb('it checks if permissions exists', (t) => {
  role.checkPermission({
    name: 'manager', permissions: 'users.write', level: 3,
  }).then((data) => {
    t.truthy((data || {}).id);
    t.end();
  });
});
