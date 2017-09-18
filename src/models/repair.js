const Promise = require('bluebird');
const _ = require('lodash');
const mongoose = require('mongoose');
const dateConverter = require('common/helpers/dateConverter');
const config = require('common/config/config');

class Repair {
  /**
   * Initializes Repair model
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
    this.jsonSchema = options.jsonSchema;
  }

  /**
   * Adds a repair for a user
   *
   * @param input
   * @returns {*|Promise}
   */
  addRepair(input) {
    const data = _.cloneDeep(input);
    data.createdAt = new Date().toISOString();
    data.updatedAt = new Date().toISOString();
    return (new this.model(data)).save();
  }

  /**
   * Updates an existing repair using repairId
   *
   * @param repairId
   * @param input
   * @returns {*|Promise}
   */
  updateRepair(repairId, input) {
    const updatedAt = { updatedAt: new Date().toISOString() };
    return this.model.findByIdAndUpdate(repairId, { $set: _.merge(updatedAt, input) }, { new: true });
  }

  /**
   * Adds an comment to repair using repairId
   *
   * @param repairId
   * @param input
   * @returns {*|Promise}
   */
  addComment(repairId, input) {
    const createdAt = { createdAt: new Date().toISOString() };
    console.log(_.merge(createdAt, input));
    return this.model.findByIdAndUpdate(repairId, { $push: { comments: _.merge(createdAt, input) } }, { new: true });
  }

  /**
   * Deletes a repair using repairId
   *
   * @param repairId
   * @returns {*|Promise}
   */
  deleteRepair(repairId) {
    return this.model.findByIdAndRemove(repairId);
  }

  /**
   * Deletes all repairs using userId
   *
   * @param repairId
   * @returns {*|Promise}
   */
  deleteRepairsByUserId(userId) {
    return this.model.deleteMany({ userId });
  }

  /**
   * Fetches a repair using RepairId
   *
   * @param repairId
   * @returns {*|Promise}
   */
  getRepair(repairId) {
    return this.model.findById(repairId);
  }

  /**
   * Queries repairs collection using the given query. Handles pagination as well.
   *
   * @param input
   * @param page
   * @param limit
   * @param order
   * @param sortby
   * @returns {*|Promise}
   */
  queryRepair(input, { page, limit = config.listing.limit, order, sortby } = {}) {
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
   * Calculates consumed calorie for a user in a particular date
   *
   * @param input.userId: ''
   * @param input.date: ''
   * @returns {*|Promise}
   */
  getConsumedCalorie(input) {
    // { userId: '', date: '' }
    const currentDate = dateConverter.addDays({ count: 0, date: input.date });
    const query = [
      { $match: { userId: input.userId, date: { $eq: currentDate } } },
      { $group: { _id: null, calories: { $sum: '$calories' } } },
    ];
    return this.model.aggregate(query).then(data => ((data && data[0]) ? data[0].calories : 0));
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

module.exports = Repair;
