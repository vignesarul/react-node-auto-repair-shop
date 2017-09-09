const validator = require('common/helpers/validator');
const _ = require('lodash');
const Promise = require('bluebird');
const exceptions = require('common/exceptions');
const stringToQuery = require('common/helpers/stringToQuery');
const Serializer = require('common/serializer');
const config = require('common/config/config');
const uuid = require('uuid/v4');
const dateConverter = require('common/helpers/dateConverter');
const mailer = require('common/mailer');

const serializer = new Serializer();

class UserController {
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
    this.registerUser = this.registerUser.bind(this);
    this.activateUser = this.activateUser.bind(this);
    this.validateLogin = this.validateLogin.bind(this);
    this.listUsers = this.listUsers.bind(this);
    this.showUser = this.showUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.populateParamsUserId = this.populateParamsUserId.bind(this);
    this.populateTokenUser = this.populateTokenUser.bind(this);
    this.updateRoles = this.updateRoles.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  /**
   * Handles create user request.
   * Send an verification code to the user's email
   * This can take higher role(admin)'s token to create pre-activated user.
   *
   * @param req
   * @param res
   * @param next
   */
  registerUser(req, res, next) {
    const body = _.cloneDeep(req.body);
    const preActivated = (((req.user || {}).roles) && (req.user || {}).roles !== 'user');
    validator.buildParams({ input: body, schema: this.jsonSchema.postSchema })
      .then(input => validator.validate({ input, schema: this.jsonSchema.postSchema }))
      .then(input => _.merge(input, preActivated ? {} : { verification: {
        code: uuid(), expiry: dateConverter.addTimeIso(2, 'd'), attempts: 0, resendAttempt: 0 } }))
      .then(input => this.model.createUser(input, preActivated))
      .then(result => Promise.all([res.status(201).send(serializer.serialize(result, { type: 'users' })),
        mailer({
          to: result.email,
          userDetails: _.merge({ password: body.password, code: (result.verification || {}).code }, _.pick(result, 'firstName')),
          template: preActivated ? 'activeNewUser' : 'newUser',
        })]))
      .catch(error => next(error));
  }

  /**
   * Checks the validity of the username and password
   *
   * @param req
   * @param res
   * @param next
   */
  validateLogin(req, res, next) {
    const body = _.cloneDeep(req.body);
    validator.buildParams({ input: body, schema: this.jsonSchema.loginSchema })
      .then(input => validator.validate({ input, schema: this.jsonSchema.loginSchema }))
      .then(input => this.model.verifyLogin(input.email, input.password))
      .then(result => (req.user = result))
      .then(() => next())
      .catch(error => next(error));
  }

  /**
   * Handles activate user request.
   * Checks the validity of the verification code and userId to activate a user account
   *
   * @param req
   * @param res
   * @param next
   */
  activateUser(req, res, next) {
    if (req.userId.status === 'GUEST' && (req.userId.verification || {}).code === req.body.code) {
      this.model.updateUser(req.userId._id, { status: 'ACTIVE', verification: {} })
        .then(result => res.status(200).send(serializer.serialize(result, { type: 'users' })))
        .catch(error => next(error));
    } else {
      next(new exceptions.UnAuthorized());
    }
  }

  /**
   * Handles show single user request
   *
   * @param req
   * @param res
   * @param next
   */
  showUser(req, res, next) {
    this.model.getUser(req.params.userId)
      .then(result => res.status(200).send(serializer.serialize(result, { type: 'users' })))
      .catch(error => next(error));
  }

  /**
   * Handles list users request.
   * Accepts filters and performs pagination
   *
   * @param req
   * @param res
   * @param next
   */
  listUsers(req, res, next) {
    const query = stringToQuery(req.query.filter);
    const searchable = _.keys(this.jsonSchema.querySchema.properties);
    _.each(query.keys, (key) => {
      if (key !== '$or' && key !== '$and' && searchable.indexOf(key) === -1) throw new exceptions.InvalidInput();
    });
    const input = typeof (query.query) === 'string' ? JSON.parse(query.query) : query.query;
    input.roles = { $in: req.user.nextLevelRoles };
    this.model.queryUser(input, _.merge({ sortby: 'updatedAt' }, _.pick(req.query, ['order', 'sortby', 'page', 'limit'])))
      .then((result) => {
        const pagination = { pagination: _.merge({ limit: config.listing.limit }, req.query), type: 'users' };
        res.status(200).send(serializer.serialize(result, pagination));
      })
      .catch(error => next(error));
  }

  /**
   * Handles update single user request.
   *
   * @param req
   * @param res
   * @param next
   */
  updateUser(req, res, next) {
    const body = _.cloneDeep(req.body);
    validator.buildParams({ input: body, schema: this.jsonSchema.updateSchema })
      .then(input => validator.validate({ input, schema: this.jsonSchema.updateSchema }))
      .then(input => this.model.updateUser(req.userId._id, input))
      .then(result => res.status(200).send(serializer.serialize(result, { type: 'users' })))
      .catch(error => next(error));
  }

  /**
   * Handles update password request for a authenticated user
   *
   * @param req
   * @param res
   * @param next
   */
  updatePassword(req, res, next) {
    const body = _.cloneDeep(req.body);
    validator.buildParams({ input: body, schema: this.jsonSchema.updatePasswordSchema })
      .then(input => validator.validate({ input, schema: this.jsonSchema.updatePasswordSchema }))
      .then(input => Promise.all([this.model.verifyLogin(req.userId.email, input.old), input]))
      .spread((data, input) => this.model.updateUser(req.userId._id, { password: input.new }))
      .then(result => res.status(200).send(serializer.serialize(result, { type: 'users' })))
      .catch(error => next(error));
  }

  /**
   * Handles update role request for a user
   *
   * @param req
   * @param res
   * @param next
   */
  updateRoles(req, res, next) {
    const body = _.cloneDeep(req.body);
    validator.buildParams({ input: body, schema: this.jsonSchema.updateRolesSchema })
      .then(input => validator.validate({ input, schema: this.jsonSchema.updateRolesSchema }))
      .then(input => this.model.updateUser(req.userId._id, { roles: input.roles }))
      .then(result => res.status(200).send(serializer.serialize(result, { type: 'users' })))
      .catch(error => next(error));
  }

  /**
   * Handles forgot-password request.
   * Initiates a email to user's email with verification code to be used to reset password
   *
   * @param req
   * @param res
   * @param next
   */
  forgotPassword(req, res, next) {
    const body = _.cloneDeep(req.body);
    let updateUserPromise = Promise.resolve();
    let mailerPromise = Promise.resolve();
    validator.buildParams({ input: body, schema: this.jsonSchema.forgotPasswordSchema })
      .then(input => validator.validate({ input, schema: this.jsonSchema.forgotPasswordSchema }))
      .then(input => this.model.queryUser(input))
      .then((result) => {
        if (result && result[0]) {
          const code = uuid();
          const input = { verification: { code, expiry: dateConverter.addTimeIso(15, 'm'), attempts: 0, resendAttempt: 0 } };
          updateUserPromise = this.model.updateUser(result[0]._id, input);
          mailerPromise = mailer({ to: result[0].email,
            userDetails: {
              firstName: result[0].firstName, code: input.verification.code },
            template: 'forgotPassword' });
        }
        updateUserPromise = updateUserPromise.then(() => res.status(202).send(serializer.serialize()));
        return Promise.all([updateUserPromise, mailerPromise]);
      })
      .catch(error => next(error));
  }

  /**
   * Handles password reset request
   * Checks the validity of the code & email to reset the password
   *
   * @param req
   * @param res
   * @param next
   */
  resetPassword(req, res, next) {
    const body = _.cloneDeep(req.body);
    const newPassword = dateConverter.getRandomNumber(10).toString();
    validator.buildParams({ input: body, schema: this.jsonSchema.resetPasswordSchema })
      .then(input => validator.validate({ input, schema: this.jsonSchema.resetPasswordSchema }))
      .then(input => this.model.queryUser({ 'verification.code': input.code, email: input.email }))
      .then((result) => {
        if (result && result[0]) {
          const input = { verification: {}, password: newPassword };
          return this.model.updateUser(result[0]._id, input);
        }
        throw new exceptions.NotFound();
      })
      .then(result => Promise.all[res.status(200).send(serializer.serialize()),
        mailer({ to: result.email,
          userDetails: {
            firstName: result.firstName, password: newPassword },
          template: 'resetPassword' })])
      .catch(error => next(error));
  }

  /**
   * Handles delete user request
   *
   * @param req
   * @param res
   * @param next
   */
  removeUser(req, res, next) {
    this.model.deleteUser(req.userId._id)
      .then(() => next())
      .catch(error => next(error));
  }

  /**
   * Fetches details of userId and saves it to req object
   *
   * @param req
   * @param res
   * @param next
   */
  populateParamsUserId(req, res, next) {
    this.model.getUser(req.params.userId).then((userData) => {
      if (!userData) {
        next(new exceptions.NotFound());
      } else {
        req.userId = userData;
        next();
      }
    }).catch(error => next(error));
  }

  /**
   * Fetches the details of token user and saves it in req object
   *
   * @param optional
   * @returns {function(*, *, *)}
   */
  populateTokenUser(optional) {
    return (req, res, next) => {
      if (optional && !req.authToken) next();
      else {
        this.model.getUser(req.authToken.userId).then((userData) => {
          if (!userData) next(new exceptions.UnAuthorized()); else {
            req.user = userData;
            next();
          }
        });
      }
    };
  }
}

module.exports = UserController;
