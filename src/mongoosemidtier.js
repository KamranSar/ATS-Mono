/* eslint-disable no-unused-vars */
const debug = require('debug')(`${process.env.APP_NAME}:`+'src:mongoosemidtier:dbname');
const { logger } = require('cdcrhelpers');
const mongoose = require('mongoose');
const mongoose2 = new mongoose.Mongoose();

module.exports = function (app) {
  const { server, port, database, connectTimeoutMS, poolSize } = app.get('mongodbmidtier');
  if (!server || server.length < 1 || !port || port.length < 1) {
    logger.error('mongodbMidTier (Mongoose) server or port must be specified in configuration, exiting...');
    process.exit(1);
  }

  // Connect to the Mongo database
  let connUrlMidTier = `mongodb://${server}:${port}/${database}`;
  debug('Connecting to mongodbMidTier (Mongoose) database (%s) using connection string: %s', database, connUrlMidTier);
  mongoose2
    .connect(connUrlMidTier, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: connectTimeoutMS,
      poolSize: poolSize,
    })
    .then(() => {
      debug('Successfully connected to mongodbMidTier (Mongoose) database (%s) at %s', database, connUrlMidTier);
    })
    .catch((error) => {
      logger.error('mongodbMidTier (Mongoose) connection error at %s - ', connUrlMidTier, {
        error: error.message || error,
      });
      process.exit(1);
    });

  mongoose2.Promise = global.Promise;
  app.set('mongooseClientMidTier', mongoose2);
};
