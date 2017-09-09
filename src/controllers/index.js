const UserController = require('controllers/user');
const AccessController = require('controllers/access');
const RoleController = require('controllers/role');
const RepairController = require('controllers/repair');

module.exports = models => ({
  user: new UserController(models.user),
  access: new AccessController(models.access),
  role: new RoleController(models.role),
  repair: new RepairController(models.repair),
});
