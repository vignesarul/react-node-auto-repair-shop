const validator = require('common/helpers/validator');
const Promise = require('bluebird');
const _ = require('lodash');
const exceptions = require('common/exceptions');
const Serializer = require('common/serializer');

const serializer = new Serializer();

class RoleController {
  /**
   * Initializes Role Controller
   *
   * @param: {
   *  model : model reference
   * }
   */
  constructor(model) {
    this.model = model;
    this.jsonSchema = model.getJsonSchema();
    this.addRole = this.addRole.bind(this);
    this.getRole = this.getRole.bind(this);
    this.validateRole = this.validateRole.bind(this);
    this.getNextLevelRoles = this.getNextLevelRoles.bind(this);
  }

  /**
   * Handles add role request
   *
   * @param req
   * @param res
   * @param next
   */
  addRole(req, res, next) {
    const body = _.cloneDeep(req.body);
    validator.buildParams({ input: body, schema: this.jsonSchema.postSchema })
      .then(input => validator.validate({ input, schema: this.jsonSchema.postSchema }))
      .then(input => this.model.addRole(input))
      .then(result => res.status(201).send(serializer.serialize(result, { type: 'roles' })))
      .catch(error => next(error));
  }

  /**
   * Fetches subordinate roles for a particular role. Eg: For admin, sub roles are user-manager & user
   *
   * @param req
   * @param res
   * @param next
   */
  getNextLevelRoles(req, res, next) {
    this.model.queryRole({ level: { $gt: req.user.roleLevel } })
      .then((roleData) => {
        req.user.nextLevelRoles = _.map(roleData, 'name');
        next();
      });
  }

  /**
   * Checks if a role exists before assigning it to user
   *
   * @param req
   * @param res
   * @param next
   */
  getRole(req, res, next) {
    this.model.queryRole({ name: req.body.roles })
      .then((roleData) => {
        if (!(roleData && roleData[0])) {
          next(new exceptions.NotFound([{ message: 'Given "roles" does not exist' }]));
        } else {
          next();
        }
      });
  }

  /**
   * Validates if a role has influence on other role to perform a particular a action on its resource(users, meals)
   *
   * @param resource
   * @param action
   */
  validateRole(resource, action) {
    return (req, res, next) => {
      let getUserRole = Promise.resolve();
      let userRoleLevel;
      if (req.userId) {
        getUserRole = getUserRole.then(() => this.model.getRoleByName(req.userId.roles).then(roleData => (userRoleLevel = roleData.level)));
      }

      getUserRole.then(() => {
        const selfRequest = (req.user._id.toString() === (req.userId && req.userId._id.toString()));
        const input = { name: req.user.roles, permissions: `${selfRequest ? '_.' : ''}${resource}.${action}` };
        if (!selfRequest) input.level = userRoleLevel;
        return this.model.checkPermission(input)
          .then((result) => {
            if (result && result._id) {
              req.user.roleLevel = result.toObject().level;
              next();
            } else next(new exceptions.UnAuthorized());
          });
      }).catch(error => next(error));
    };
  }
}

module.exports = RoleController;
