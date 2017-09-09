const express = require('express');
const bodyParser = require('body-parser');
const Connection = require('common/database/connection');
const models = require('models');
const controllers = require('controllers');
const routes = require('server/routes');
const logger = require('common/logger');
const middlewares = require('server/middlewares');
const config = require('common/config/config');

const app = express();
const dbConnection = new Connection(config.database);
let dbModels;
dbConnection.getModels = () => dbModels;

dbConnection.connect().then(() => {
  app.use(bodyParser.json());
  app.all('/*', middlewares.enableCors);
  dbModels = models(dbConnection.db);
  routes(express, app, controllers(dbModels));

  // If no route is matched by now, it must be a 404
  app.use(middlewares.noMatchingRoutes);

  // Error handler
  app.use(middlewares.errorHandler);

  // Start the server
  const server = app.listen(config.server.port, () => {
    logger.info(`Express server listening on port ${server.address().port}`);
  }).on('error', (err) => { });
});

module.exports = {
  app,
  dbConnection,
};
