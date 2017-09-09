const _ = require('lodash');
const querystring = require('querystring');

class Serializer {
  /**
   * Initializes serializer mapping
   */
  constructor() {
    this.mapping = {
      links: {},
      data: [],
      errors: {},
      meta: {},
    };
  }

  /**
   * Gets the mapping for serializing data
   * @returns {*}
   */
  getMapping() {
    return _.cloneDeep(this.mapping);
  }

  /**
   * Serializes the data to send as response for JSON REST API
   *
   * @param sourceData
   * @param pagination
   * @param type
   * @returns {*}
   */
  serialize(sourceData, { pagination = {}, type } = {}) {
    const mapping = this.getMapping();
    if (sourceData instanceof Error) {
      if (_.isArray(sourceData.detail)) {
        mapping.errors = Serializer.processErrors(sourceData.detail, sourceData.message,
          sourceData.statusCode);
        mapping.meta = {
          errorCount: mapping.errors.length,
        };
      } else {
        mapping.errors = [{
          code: sourceData.message, detail: sourceData.detail || '', status: sourceData.statusCode,
        }];
        mapping.meta = {
          errorCount: mapping.errors.length,
        };
      }
      return mapping;
    }

    if (_.isEmpty(sourceData)) return mapping;

    if ((!_.isEmpty(pagination)) && _.isArray(sourceData)) {
      mapping.meta = {
        count: sourceData.length,
      };
      mapping.links = {
        next: (pagination.limit && Number(pagination.limit) === sourceData.length) ? `?${querystring.stringify(_.omit(pagination, ['next', 'prev', 'page']))}&page=${Number(pagination.page || 1) + 1}` : '',
        prev: pagination.page > 1 ? `?${querystring.stringify(_.omit(pagination, ['next', 'prev', 'page']))}&page=${pagination.page - 1}` : '',
      };
    }

    mapping.data = _.map((_.isArray(sourceData) ? sourceData : [sourceData]), (data) => {
      const record = typeof data.toObject === 'function' ? data.toObject() : data;
      if (!_.isPlainObject(record)) return {};
      return {
        id: record._id,
        type,
        attributes: _.omit(record, ['_id', 'password', '__v', 'verification']),
      };
    });
    return mapping;
  }

  /**
   * Serializes the errors
   *
   * @param detail
   * @param code
   * @param status
   * @returns {Array}
   */
  static processErrors(detail, code, status) {
    const result = [];
    _.each(detail, (error) => {
      let field = '';
      if (error.message && error.message.indexOf('pattern') === -1 && error.message.split('"').length > 1) {
        field = error.message.split('"')[1];
      } else field = error.property.split('.')[1];
      result.push({
        code,
        detail: error.message,
        source: {
          parameter: field,
        },
        status,
      });
    });
    return result;
  }
}

module.exports = Serializer;
