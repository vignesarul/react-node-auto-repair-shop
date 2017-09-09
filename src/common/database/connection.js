const mongoose = require('mongoose');
const bluebird = require('bluebird');
const logger = require('common/logger');

class Connection {
  /**
   * Construct the connection class
   */
  constructor(options) {
    this.options = options;
    this.connectedStatus = false;
    this.db = undefined;
    mongoose.Promise = bluebird;
  }

  /**
   * Initiates connection with mongodb
   *
   * @returns {Promise}
   */
  connect() {
    return mongoose.connect(this.options.uri, { config: { autoIndex: false }, useMongoClient: true })
      .then((db) => {
        logger.info('Database connected');
        this.db = db;
        this.connectedStatus = true;
      });
  }

  /**
   * Returns status of connection
   *
   * @returns {boolean}
   */
  isConnected() {
    return this.connectedStatus;
  }
}

module.exports = Connection;
