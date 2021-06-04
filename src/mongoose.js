/* eslint-disable no-unused-vars */
const debug = require('debug')(`${process.env.APP_NAME}:` + 'src:mongoose:dbname');
const { logger } = require('cdcrhelpers');
const mongoose = require('mongoose');
const serverData = require('./service-config').server;

module.exports = function (app) {
  if (serverData.mongooseEnabled) {
    const { server, port, database, connectTimeoutMS, poolSize } = app.get('mongodb');
    if (!server || server.length < 1 || !port || port.length < 1) {
      logger.error('MongoDb (Mongoose) server or port must be specified in configuration, exiting...');
      process.exit(1);
    }

    // Connect to the Mongo database
    let connUrlMidTier = `mongodb://${server}:${port}/${database}`;
    debug('Connecting to mongoDb (Mongoose) database (%s) using connection string: %s', database, connUrlMidTier);
    mongoose
      .connect(connUrlMidTier, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: connectTimeoutMS,
        poolSize: poolSize,
      })
      .then(() => {
        debug('Successfully connected to mongoDb (Mongoose) database (%s) at %s', database, connUrlMidTier);
      })
      .catch((error) => {
        logger.error('MongoDb (Mongoose) connection error at %s - ', connUrlMidTier, { error: error.message || error });
        process.exit(1);
      });

    mongoose.Promise = global.Promise;
    app.set('mongooseClient', mongoose);
  }
};
