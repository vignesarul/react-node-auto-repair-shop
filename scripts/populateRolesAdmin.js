const Connection = require('common/database/connection');
const models = require('models');
const config = require('common/config/config');
const Promise = require('bluebird');

const dbConnection = new Connection(config.database);

const roles = [{
  name: 'manager',
  permissions: [
    '_.users.read', '_.users.write', '_.users.update', '_.users.delete', 'repairs.read', 'repairs.approve', '_.repairs.approve', 'repairs.write', 'repairs.update',
    'repairs.delete', '_.repairs.read', '_.repairs.write', '_.repairs.update', '_.repairs.delete', 'users.read', 'users.write', 'users.update', 'users.delete', 'roles.write',
  ],
  level: 1,
}, {
  name: 'user',
  permissions: [
    '_.users.read', '_.users.write', '_.users.update', '_.repairs.read', '_.repairs.update',
  ],
  level: 3,
}];
const users = [{
  password: '1234567890',
  firstName: 'Admin',
  lastName: 'A',
  email: 'admin@admin.com',
  roles: 'manager',
}];

dbConnection.connect().then(() => {
  const promiseArray = [];
  const dbModels = models(dbConnection.db);
  roles.forEach(role => promiseArray.push(dbModels.role.addRole(role)));
  users.forEach(user => promiseArray.push(dbModels.user.createUser(user, true).then(userDetails => dbModels.user.updateUser(userDetails.id, { roles: user.roles }))));
  return Promise.all(promiseArray);
}).then(() => {
  console.log('Initial populate completed');
  process.exit(1);
}).catch(err => console.log(err));
