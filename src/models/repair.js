const Promise = require('bluebird');
const _ = require('lodash');
const mongoose = require('mongoose');
const dateConverter = require('common/helpers/dateConverter');
const NutritionixClient = require('nutritionix');
const config = require('common/config/config');

class Meal {
  /**
   * Initializes Meal model
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
    this.nutritionix = new NutritionixClient({
      appId: config.nutritionix.id,
      appKey: config.nutritionix.key,
    });
  }

  /**
   * Adds a meal for a user
   *
   * @param input
   * @returns {*|Promise}
   */
  addMeal(input) {
    const data = _.cloneDeep(input);
    data.createdAt = new Date().toISOString();
    data.updatedAt = new Date().toISOString();
    return (new this.model(data)).save();
  }

  /**
   * Updates an existing meal using mealId
   *
   * @param mealId
   * @param input
   * @returns {*|Promise}
   */
  updateMeal(mealId, input) {
    const updatedAt = { updatedAt: new Date().toISOString() };
    return this.model.findByIdAndUpdate(mealId, { $set: _.merge(updatedAt, input) }, { new: true });
  }

  /**
   * Deletes a meal using mealId
   *
   * @param mealId
   * @returns {*|Promise}
   */
  deleteMeal(mealId) {
    return this.model.findByIdAndRemove(mealId);
  }

  /**
   * Deletes all meals using userId
   *
   * @param mealId
   * @returns {*|Promise}
   */
  deleteMealsByUserId(userId) {
    return this.model.deleteMany({ userId });
  }

  /**
   * Fetches a meal using MealId
   *
   * @param mealId
   * @returns {*|Promise}
   */
  getMeal(mealId) {
    return this.model.findById(mealId);
  }

  /**
   * Queries meals collection using the given query. Handles pagination as well.
   *
   * @param input
   * @param page
   * @param limit
   * @param order
   * @param sortby
   * @returns {*|Promise}
   */
  queryMeal(input, { page, limit = config.listing.limit, order, sortby } = {}) {
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
   * Fetches calorie information from nutritionix.com by searching the description of food
   *
   * @param food
   * @returns {*|Promise}
   */
  getNutriCalories(food) {
    return this.nutritionix.natural(food).then(data => parseInt(_.find(data.results[0].nutrients, { usda_tag: 'ENERC_KCAL' }).value || 0, 10))
      .catch(() => (0));
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

module.exports = Meal;
