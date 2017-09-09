const UserController = require('controllers/user');
const AccessController = require('controllers/access');
const RoleController = require('controllers/role');
const MealController = require('controllers/meal');

module.exports = models => ({
  user: new UserController(models.user),
  access: new AccessController(models.access),
  role: new RoleController(models.role),
  meal: new MealController(models.meal),
});
