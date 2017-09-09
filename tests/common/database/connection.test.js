import test from 'ava';
import Connection from 'common/database/connection';
import config from 'common/config/config';

test.cb('it creates a new database connection', (t) => {
  const db = new Connection(config.database);
  db.connect().then(() => {
    t.truthy(db.isConnected());
    t.end();
  });
});
