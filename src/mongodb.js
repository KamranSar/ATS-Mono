const { MongoClient } = require('mongodb');
const debug = require('debug')(`${process.env.APP_NAME}:`+'src:mongodb:dbname');
const { logger } = require('cdcrhelpers');

module.exports = function (app) {
  const { server, port, database, connectTimeoutMS, poolSize } = app.get('mongodb');
  if (!server || server.length < 1 || !port || port.length < 1) {
    logger.error('MongoDb server or port must be specified in configuration, exiting...');
    process.exit(1);
  }

  const dbConnection = `mongodb://${server}:${port}/${database}`;
  debug('Connecting to mongoDb database (%s) using connection string: %s', database, dbConnection);
  const mongoClient = new MongoClient.connect(dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: connectTimeoutMS,
    poolSize: poolSize,
  })
    .then((client) => {
      debug('Successfully connected to mongoDb database (%s) at %s', database, dbConnection);
      return client.db(database);
    })
    .catch((error) => {
      logger.error(`MongoDb database ${database} error at ${dbConnection} - `, { error: error.message || error });
      process.exit(1);
    });
  app.set('mongoClient', mongoClient); // For use by all apps for middle tier databases - Feathers wants it this way
};
