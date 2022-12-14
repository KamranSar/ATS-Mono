const MongoClient = require('mongodb').MongoClient;
const debug = require('debug')(`${process.env.APP_NAME}:` + 'src:mongodb:dbname');
const { logger } = require('cdcrhelpers');
const serverData = require('./service-config').server;

module.exports = function (app) {
  // Mongodb connection for this app server.
  if (serverData.mongodbEnabled) {
    const { server, port, database, connectTimeoutMS } = app.get('mongodb');
    if (!server || server.length < 1 || !port || port.length < 1) {
      logger.error('MongoDb server or port must be specified in configuration, exiting...');
      process.exit(1);
    }

    const dbConnection = `mongodb://${server}:${port}/${database}`;
    debug('Connecting to mongoDb database (%s) using connection string: %s', database, dbConnection);
    const mongoClient = MongoClient.connect(dbConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: connectTimeoutMS,
    })
      .then((client) => {
        if (process.env.NODE_ENV === 'production')
          logger.info('Successfully connected to mongoDb database (%s) at %s', database, dbConnection);
        else debug('Successfully connected to mongoDb database (%s) at %s', database, dbConnection);
        app.mongoConnected = true;
        return client.db(database);
      })
      .catch((error) => {
        logger.error(`MongoDb database ${database} error at ${dbConnection} - `, error);
        process.exit(1);
      });
    app.set('mongoClient', mongoClient); // For use by all apps for middle tier databases - Feathers wants it this way
  }
};
