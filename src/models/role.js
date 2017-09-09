const Promise = require('bluebird');
const mongoose = require('mongoose');
const _ = require('lodash');
const exceptions = require('common/exceptions');
const uniqueValidator = require('mongoose-unique-validator');

class Role {
  /**
   * Initializes Role model
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
    this.jsonSchema = options.jsonSchema;
  }

  /**
   * Adds a new role
   *
   * @param input
   * @returns {*|Promise}
   */
  addRole(input) {
    const data = _.cloneDeep(input);
    data.createdAt = new Date().toISOString();
    data.updatedAt = new Date().toISOString();
    return (new this.model(data)).save().catch((err) => {
      const constructErrors = field => ({ message: `"${field}" should be unique` });
      throw new exceptions.DuplicateRecord(Object.keys(err.errors).map(constructErrors));
    });
  }

  /**
   * Fetches role record by name
   *
   * @param input
   * @returns {*|Promise}
   */
  getRoleByName(input) {
    return this.model.findOne({ name: input });
  }

  /**
   * Queries role using the given query
   *
   * @param input
   * @returns {*|Promise}
   */
  queryRole(input) {
    return new Promise((resolve, reject) => {
      this.model.find(input).find((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  /**
   * Validates the permission for given role(name) & permissions needed with level
   *
   * @param name
   * @param permissions
   * @param level
   * @returns {*|Promise}
   */
  checkPermission({ name, permissions, level }) {
    const query = {
      name,
      permissions,
    };
    if (level) query.level = { $lt: level };
    return this.model.findOne(query);
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

module.exports = Role;
