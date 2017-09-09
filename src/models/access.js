const Promise = require('bluebird');
const _ = require('lodash');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const exceptions = require('common/exceptions');

class Access {
  /**
   * Initializes Access model
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
    this.model = this.db.model(options.tableName, this.schema);
    this.signature = options.signature;
    this.jsonSchema = options.jsonSchema;
  }

  /**
   * Adds a new record in access table - Representing a new login
   *
   * @param input
   * @returns {*|Promise}
   */
  createAccessLog(input) {
    const data = _.cloneDeep(input);
    data.createdAt = new Date().toISOString();
    data.updatedAt = new Date().toISOString();
    return (new this.model(data)).save();
  }

  /**
   * Updates a access log record
   *
   * @param id
   * @param input
   * @returns {*|Promise}
   */
  updateAccessLog(id, input) {
    const updatedAt = { updatedAt: new Date().toISOString() };
    return this.model.findByIdAndUpdate(id, { $set: _.merge(updatedAt, input) }, { new: true });
  }

  /**
   * Fetches a access record using id field
   *
   * @param id
   * @returns {*|Promise}
   */
  getAccessLog(id) {
    return this.model.findById(id);
  }

  /**
   * Queries the access table with a query
   *
   * @param input
   * @returns {*|Promise}
   */
  queryAccessLog(input) {
    return new Promise((resolve, reject) => {
      this.model.find(input).find((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  /**
   * Creates a JWT token
   *
   * @param {
   *  userId: user's Id
   *  id: access table's id
   * }
   * @param {}
   */
  createJwtToken(input) {
    return new Promise((resolve) => {
      const token = {
        userId: input.userId,
        id: input._id,
      };
      resolve({ access_token: jwt.sign(token, this.signature, { expiresIn: '1 days' }) });
    });
  }

  /**
   * Verifies the supplied token is not expired and has valid signature
   *
   * @param token
   */
  verifyToken(token) {
    return new Promise((resolve) => {
      resolve(jwt.verify(token, this.signature));
    }).catch(error => new exceptions.UnAuthorized(error));
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

module.exports = Access;
