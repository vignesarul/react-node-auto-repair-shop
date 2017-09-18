const config = require('common/config/config');

const routes = (express, app, { user, access, role, repair }) => {
  const route = express.Router();

  route.post('/auth/login', user.validateLogin, access.performLogin);
  route.post('/auth/forgot-password', user.forgotPassword);
  route.post('/auth/reset-password', user.resetPassword);

  route.get('/users', access.verifyAuth(), user.populateTokenUser(), role.validateRole('users', 'read'), role.getNextLevelRoles, user.listUsers);
  route.post('/users', access.verifyAuth(true), user.populateTokenUser(true), user.registerUser);
  route.put('/users/:userId', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('users', 'update'), user.updateUser);
  route.put('/users/:userId/activate', user.populateParamsUserId, user.activateUser);
  route.put('/users/:userId/password', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('users', 'update'), user.updatePassword);
  route.put('/users/:userId/roles', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('users', 'delete'), role.getRole, user.updateRoles);
  route.get('/users/:userId', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('users', 'read'), user.showUser);
  route.delete('/users/:userId', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('users', 'delete'), user.removeUser, repair.removeRepairsByUserId);

  route.get('/repairs', access.verifyAuth(), user.populateTokenUser(), role.validateRole('repairs', 'approve'), repair.listAllRepairs);
  route.get('/users/:userId/repairs', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('repairs', 'read'), repair.listRepairs);
  route.post('/users/:userId/repairs', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('repairs', 'write'), repair.addRepair);
  route.put('/users/:userId/repairs/:repairId/manage', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('repairs', 'approve'), repair.verifyRepairOwner, repair.updateRepairByManager);
  route.put('/users/:userId/repairs/:repairId', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('repairs', 'update'), repair.verifyRepairOwner, repair.updateRepairByUser);
  route.post('/users/:userId/repairs/:repairId/comment', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('repairs', 'update'), repair.verifyRepairOwner, repair.addComment);
  route.get('/users/:userId/repairs/:repairId', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('repairs', 'read'), repair.verifyRepairOwner, repair.showRepair);
  route.delete('/users/:userId/repairs/:repairId', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('repairs', 'delete'), repair.verifyRepairOwner, repair.removeRepair);

  route.post('/roles', access.verifyAuth(), user.populateTokenUser(), role.validateRole('roles', 'write'), role.addRole);

  app.use(`/api/${config.server.version}`, route);
};

module.exports = routes;
