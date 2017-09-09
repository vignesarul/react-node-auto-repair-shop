const config = require('common/config/config');

const routes = (express, app, { user, access, role, meal }) => {
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
  route.delete('/users/:userId', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('users', 'delete'), user.removeUser, meal.removeMealsByUserId);

  route.get('/users/:userId/meals', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('meals', 'read'), meal.listMeals);
  route.post('/users/:userId/meals', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('meals', 'write'), meal.addMeal);
  route.put('/users/:userId/meals/:mealId', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('meals', 'update'), meal.verifyMealOwner, meal.updateMeal);
  route.get('/users/:userId/meals/:mealId', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('meals', 'read'), meal.verifyMealOwner, meal.showMeal);
  route.delete('/users/:userId/meals/:mealId', access.verifyAuth(), user.populateParamsUserId, user.populateTokenUser(), role.validateRole('meals', 'delete'), meal.verifyMealOwner, meal.removeMeal);

  route.post('/roles', access.verifyAuth(), user.populateTokenUser(), role.validateRole('roles', 'write'), role.addRole);

  app.use(`/api/${config.server.version}`, route);
};

module.exports = routes;
