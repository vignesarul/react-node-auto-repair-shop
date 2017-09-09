const bunyan = require('bunyan');

/**
 * Creates a logger instance
 */
const logger = bunyan.createLogger({ name: 'calorie-backend' });

module.exports = logger;
