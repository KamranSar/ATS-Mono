const { MongoClient } = require('mongodb');
const debug = require('debug')(`${process.env.APP_NAME}:` + 'src:mongodb:dbname');
const { logger, configureMongoSvcStatConnection } = require('cdcrhelpers');
const serverData = require('./index.json').server;

module.exports = function (app) {
  const { server, port, database, midtierdatabase, statsdatabase, connectTimeoutMS, poolSize } = app.get('mongodb');
  if (!server || server.length < 1 || !port || port.length < 1) {
    logger.error('MongoDb server or port must be specified in configuration, exiting...');
    process.exit(1);
  }

  // Mongodb connection for this app server.
  if (serverData.mongodbEnabled) {
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
        logger.error(`MongoDb database ${database} error at ${dbConnection} - `, error);
        process.exit(1);
      });
    app.set('mongoClient', mongoClient); // For use by all apps for middle tier databases - Feathers wants it this way
  }

  // Mongodb connection required for access to the user table for JWT validation
  // This is required in order for this server to operate properly
  {
    const dbConnection = `mongodb://${server}:${port}/${midtierdatabase}`;
    debug('Connecting to mongoDb midtierdatabase (%s) using connection string: %s', midtierdatabase, dbConnection);
    const mongoClient = new MongoClient.connect(dbConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: connectTimeoutMS,
      poolSize: poolSize,
    })
      .then((client) => {
        debug('Successfully connected to mongoDb midtier database (%s) at %s', midtierdatabase, dbConnection);
        return client.db(midtierdatabase);
      })
      .catch((error) => {
        logger.error(`MongoDb midtier database ${midtierdatabase} error at ${dbConnection} - `, error);
        process.exit(1);
      });
    app.set('midtierMongoClient', mongoClient); // Used only for user authentication with JWTs.  See services/users/user.class.js
  }

  // Configure the Stats database for the logging middleware
  configureMongoSvcStatConnection(app, server, port, statsdatabase, connectTimeoutMS, poolSize);
};
