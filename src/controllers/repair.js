const validator = require('common/helpers/validator');
const _ = require('lodash');
const exceptions = require('common/exceptions');
const stringToQuery = require('common/helpers/stringToQuery');
const Serializer = require('common/serializer');
const dateConverter = require('common/helpers/dateConverter');
const config = require('common/config/config');

const serializer = new Serializer();

class RepairController {
  /**
   * Initializes Repair Controller
   *
   * @param: {
   *  model : model reference
   * }
   */
  constructor(model) {
    this.model = model;
    this.jsonSchema = model.getJsonSchema();
    this.addRepair = this.addRepair.bind(this);
    this.listRepairs = this.listRepairs.bind(this);
    this.showRepair = this.showRepair.bind(this);
    this.updateRepairByManager = this.updateRepairByManager.bind(this);
    this.updateRepairByUser = this.updateRepairByUser.bind(this);
    this.removeRepair = this.removeRepair.bind(this);
    this.removeRepairsByUserId = this.removeRepairsByUserId.bind(this);
    this.verifyRepairOwner = this.verifyRepairOwner.bind(this);
    this.checkRepairTimeSlot = this.checkRepairTimeSlot.bind(this);
  }

  /**
   * Handles Add repairs request.
   * Checks if calories is provided. If not, Adds autoFetch:false, which will trigger calorie auto-calculation later
   * Dailygoal boolean calculation will also happen later
   * Returns 202 if calorie is auto-calulated. Defaults to 201
   *
   * @param req
   * @param res
   * @param next
   */
  addRepair(req, res, next) {
    const defaultValues = {
      userId: req.userId.id,
      createdBy: req.user.id,
    };
    const body = _.merge(req.body, defaultValues);
    validator.buildParams({ input: body, schema: this.jsonSchema.postSchema })
      .then(input => validator.validate({ input, schema: this.jsonSchema.postSchema }))
      .then(input => this.checkRepairTimeSlot(input))
      .then(input => this.model.addRepair(input))
      .then(result => res.status(201).send(serializer.serialize(result.toObject(), { type: 'repairs' })))
      .catch(error => next(error));
  }

  /**
   * Handles get single repair request
   *
   * @param req
   * @param res
   * @param next
   */
  showRepair(req, res, next) {
    this.model.getRepair(req.params.repairId)
      .then(result => res.status(200).send(serializer.serialize(result, { type: 'repairs' })))
      .catch(error => next(error));
  }

  /**
   * Handles list repairs request. Performs pagination, process filter queries
   *
   * @param req
   * @param res
   * @param next
   */
  listRepairs(req, res, next) {
    const query = stringToQuery(req.query.filter);
    const searchable = _.keys(this.jsonSchema.querySchema.properties);
    _.each(query.keys, (key) => {
      if (key !== '$or' && key !== '$and' && searchable.indexOf(key) === -1) {
        throw new exceptions.InvalidInput({ message: [`${key} field is not searchable`] });
      }
    });
    const input = typeof (query.query) === 'string' ? JSON.parse(query.query) : query.query;
    input.userId = req.params.userId;
    this.model.queryRepair(input, _.merge({ sortby: 'date,time' }, _.pick(req.query, ['order', 'sortby', 'page', 'limit'])))
      .then((result) => {
        const pagination = { pagination: _.merge({ limit: config.listing.limit }, req.query), type: 'repairs' };
        res.status(200).send(serializer.serialize(result, pagination));
      })
      .catch(error => next(error));
  }

  /**
   * Handles update repair request
   *
   * @param req
   * @param res
   * @param next
   */
  updateRepairByUser(req, res, next) {
    const data = _.omit(req.body, req.body.completed === false ? 'completed' : '');
    validator.buildParams({ input: data, schema: this.jsonSchema.updateByUserSchema })
      .then(input => validator.validate({ input, schema: this.jsonSchema.updateByUserSchema }))
      .then(input => this.checkRepairTimeSlot(_.merge(input, { id: req.params.repairId })))
      .then(input => this.model.updateRepair(req.params.repairId, _.omit(input, 'id')))
      .then(result => res.status(200).send(serializer.serialize(result.toObject(), { type: 'repairs' })))
      .catch(error => next(error));
  }

  /**
   * Handles update repair request
   *
   * @param req
   * @param res
   * @param next
   */
  updateRepairByManager(req, res, next) {
    const data = _.merge(req.body, {});
    validator.buildParams({ input: data, schema: this.jsonSchema.updateByManagerSchema })
      .then(input => validator.validate({ input, schema: this.jsonSchema.updateByManagerSchema }))
      .then(input => this.checkRepairTimeSlot(_.merge(input, { id: req.params.repairId })))
      .then(input => this.model.updateRepair(req.params.repairId, _.omit(input, 'id')))
      .then(result => res.status(200).send(serializer.serialize(result.toObject(), { type: 'repairs' })))
      .catch(error => next(error));
  }

  /**
   * Handles remove repair request
   *
   * @param req
   * @param res
   * @param next
   */
  removeRepair(req, res, next) {
    this.model.deleteRepair(req.params.repairId)
      .then(() => res.status(204).send(serializer.serialize()))
      .catch(error => next(error));
  }

  /**
   * Additional handler for delete user. This deletes all repairs belongs to a user while user is deleted.
   *
   * @param req
   * @param res
   * @param next
   */
  removeRepairsByUserId(req, res, next) {
    this.model.deleteRepairsByUserId(req.userId.id)
      .then(() => res.status(204).send(serializer.serialize()))
      .catch(error => next(error));
  }

  checkRepairTimeSlot(input) {
    if (!input.time) return input;
    const { date: startDate, time: startTime } = dateConverter.addTime({ count: -1, time: input.time, date: input.date });
    const { date: endDate, time: endTime } = dateConverter.addTime({ count: 1, time: input.time, date: input.date });
    const query = {
      date: { $gte: startDate, $lte: endDate },
      time: { $gte: startTime, $lte: endTime },
    };
    if (input.id || input.repairId) query._id = { $ne: input.id || input.repairId };
    return this.model.queryRepair(query)
      .then((result) => {
        if (result.length > 0) throw new exceptions.FacilityOccupied();
        return input;
      });
  }

  /**
   * Verifies if the :userId in path is the owner of :repairs in path
   *
   * @param req
   * @param res
   * @param next
   */
  verifyRepairOwner(req, res, next) {
    this.model.getRepair(req.params.repairId)
      .then((result) => {
        if (!result) next(new exceptions.NotFound());
        else if (result.userId !== req.params.userId) next(new exceptions.UnAuthorized());
        else next();
      })
      .catch(error => next(error));
  }
}

module.exports = RepairController;
