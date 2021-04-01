const { MongoClient } = require('mongodb');
const debug = require('debug')(`${process.env.APP_NAME}:`+'src:mongodbmidtier:dbname');
const { logger, configureMongoSvcStatConnection } = require('cdcrhelpers');

module.exports = function (app) {
  const { server, port, database, statsdatabase, connectTimeoutMS, poolSize } = app.get('mongodbmidtier');
  if (!server || server.length < 1 || !port || port.length < 1) {
    logger.error('mongodbMidTier server or port must be specified in configuration, exiting...');
    process.exit(1);
  }

  const dbConnection = `mongodb://${server}:${port}/${database}`;
  debug('Connecting to mongodbMidTier database (%s) using connection string: %s', database, dbConnection);
  const mongoClient = new MongoClient.connect(dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: connectTimeoutMS,
    poolSize: poolSize,
  })
    .then((client) => {
      debug('Successfully connected to mongodbMidTier database (%s) at %s', database, dbConnection);
      return client.db(database);
    })
    .catch((error) => {
      logger.error(`mongodbMidTier database ${database} error at ${dbConnection} - `, {error: error.message || error});
      process.exit(1);
    });
  app.set('mongoClientMidTier', mongoClient); // For use by all apps for middle tier databases

  // Configure the Stats database for the logging middleware
  configureMongoSvcStatConnection(app, server, port, statsdatabase, connectTimeoutMS, poolSize);
};
