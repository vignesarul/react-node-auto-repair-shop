const Promise = require('bluebird');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const exceptions = require('common/exceptions');
const config = require('common/config/config');
const uniqueValidator = require('mongoose-unique-validator');

class User {
  /**
   * Initializes User model
   *
   * @param: {
   *  db : database reference
   *  schema: mongoose schema
   *  signature: jwt signature
   *  jsonSchema: original jsonSchemas for the model
   * }
   */
  constructor(options) {
    this.db = options.db;
    this.schema = new mongoose.Schema(options.schema);
    this.schema.plugin(uniqueValidator);
    this.model = this.db.model(options.tableName, this.schema);
    this.salt = options.salt;
    this.jsonSchema = options.jsonSchema;
  }

  /**
   * Creates a new user.
   * Based on preActivated param value, the user will be pre-activated. New user email also varies accordingly.
   *
   * @param input
   * @param preActivated
   * @returns {*|Promise}
   */
  createUser(input, preActivated) {
    const data = _.cloneDeep(input);
    data.createdAt = new Date().toISOString();
    data.updatedAt = new Date().toISOString();
    data.status = preActivated ? 'ACTIVE' : 'GUEST';
    data.roles = 'user';
    data.password = this.encryptPasswordString(data.password);
    return (new this.model(data)).save().catch((err) => {
      const constructErrors = field => ({ message: `"${field}" should be unique` });
      throw new exceptions.DuplicateRecord(Object.keys(err.errors).map(constructErrors));
    });
  }

  /**
   * Updates the existing user. Password cannot be updated using this method.
   *
   * @param userId
   * @param input
   * @returns {Promise}
   */
  updateUser(userId, input) {
    const updatedAt = { updatedAt: new Date().toISOString() };
    const data = _.cloneDeep(input);
    if (data.password) data.password = this.encryptPasswordString(data.password);
    return this.model.findByIdAndUpdate(userId, { $set: _.merge(updatedAt, data) }, { new: true }).catch((err) => {
      const constructErrors = field => ({ message: `"${field}" should be unique` });
      throw new exceptions.DuplicateRecord(Object.keys(err.errors).map(constructErrors));
    });
  }

  /**
   * Removes a user record using userId
   *
   * @param userId
   * @returns {*|Promise}
   */
  deleteUser(userId) {
    return this.model.findByIdAndRemove(userId);
  }

  /**
   * Fetches a user record using userId
   *
   * @param userId
   * @returns {Query}
   */
  getUser(userId) {
    return this.model.findById(userId);
  }

  /**
   * Queries user collection using the given query. Handles pagination as well
   *
   * @param input
   * @param page
   * @param limit
   * @param order
   * @param sortby
   * @returns {*|Promise}
   */
  queryUser(input, { page, limit = config.listing.limit, order, sortby } = {}) {
    return new Promise((resolve, reject) => {
      let query = this.model.find(input);
      if (Number(page) > 0) query = query.skip((limit || config.listing.limit) * (page - 1));
      if (Number(limit) > 0) query = query.limit(Number(limit));
      if (sortby) {
        _.each(sortby.split(','), (sortField) => {
          const sort = {};
          sort[sortField] = (order === 'asc' ? 1 : -1);
          query = query.sort(sort);
        });
      }
      query.find((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  /**
   * Encrypts password using bcrypt making it ready to save in db
   *
   * @param string
   * @returns {string}
   */
  encryptPasswordString(string) {
    const hash = bcrypt.hashSync(string, this.salt);
    return hash.replace(this.salt, '');
  }

  /**
   * Compares the given password given password using bcrypt inbuit method
   *
   * @param passwordToTest
   * @param actualPassword
   * @returns {boolean}
   */
  verifyPassword(passwordToTest, actualPassword) {
    return bcrypt.compareSync(passwordToTest, this.salt + actualPassword);
  }

  /**
   * Validates the login request with email and password
   *
   * @param email
   * @param password
   * @returns {*|Promise}
   */
  verifyLogin(email, password) {
    return this.queryUser({ email }).then((data) => {
      if (data.length === 0) throw new exceptions.PasswordMismatch();
      if (!this.verifyPassword(password, data[0].password)) throw new exceptions.PasswordMismatch();
      if (data[0].status !== 'ACTIVE') throw new exceptions.UserNotActive();
      return data[0];
    });
  }

  /**
   * Returns the JSON schema of this table
   *
   * @returns {*}
   */
  getJsonSchema() {
    return this.jsonSchema;
  }
}

module.exports = User;
