const Serializer = require('common/serializer');
const logger = require('common/logger');

const serializer = new Serializer();

const enableCors = (req, res, next) => {
  logger.info('Middlewares >> enableCors', req.method, req.originalUrl, req.body);

  // CORS headers
  res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,Authorization');
  if (req.method === 'OPTIONS') res.status(200).end();
  else next();
};

const noMatchingRoutes = (req, res, next) => {
  logger.info('Middlewares >> noMatchingRoutes');
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

const errorHandler = (error, req, res, next) => {
  logger.info('Middlewares >> errorHandler', error.message, error.stack);
  res.status(error.statusCode || 500);
  res.json(serializer.serialize(error));
};

module.exports = {
  enableCors,
  noMatchingRoutes,
  errorHandler,
};
