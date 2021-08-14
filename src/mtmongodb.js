const { MongoClient } = require('mongodb');
const debug = require('debug')(`${process.env.APP_NAME}:` + 'src:mtmongodb:dbname');
const { logger, configureMongoSvcStatConnection } = require('cdcrhelpers');

module.exports = function (app) {
  const { server, port, database, connectTimeoutMS, poolSize } = app.get('mtmongodb');
  if (!server || server.length < 1 || !port || port.length < 1) {
    logger.error('MongoDb server or port must be specified in configuration, exiting...');
    process.exit(1);
  }

  // Mongodb connection required for access to the user table for JWT validation
  // This is required in order for this server to operate properly
  const dbConnection = `mongodb://${server}:${port}/${database}`;
  debug('Connecting to mongoDb midtierdatabase (%s) using connection string: %s', database, dbConnection);
  const mongoClient = new MongoClient.connect(dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: connectTimeoutMS,
    poolSize: poolSize,
  })
    .then((client) => {
      if (process.env.NODE_ENV === 'production') logger.info('Successfully connected to mongoDb midtier database (%s) at %s', database, dbConnection);
      else debug('Successfully connected to mongoDb midtier database (%s) at %s', database, dbConnection);
      app.mtMongoConnected = true;
      return client.db(database);
    })
    .catch((error) => {
      logger.error(`MongoDb midtier database ${database} error at ${dbConnection} - `, error);
      process.exit(1);
    });
  app.set('midtierMongoClient', mongoClient); // Used only for user authentication with JWTs.  See services/users/user.class.js

  // Configure the Stats database for the logging middleware
  configureMongoSvcStatConnection(app, server, port, database, connectTimeoutMS, poolSize);
};
