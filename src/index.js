process.env.APP_NAME = require('../package.json').name;
const app = require('./app');
const debug = require('debug')(`${process.env.APP_NAME}:`+'src:index');
const { logger } = require('cdcrhelpers');
const port = app.get('port') || app.get('serverport');
const server = app.listen(port);

process.on('SIGINT', function () {
  debug('SIGINT received, terminating program!');
  process.exit(0);
  // db.stop(function(err) {
  // process.exit(err ? 1 : 0);
  // });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection Reason:  ', {reason});
  logger.error('Unhandled Rejection Promise: ', {promise});
  // process.exit(1);
});

process.on('uncaughtException', (error, origin) => {
  if (origin) logger.error('Uncaught Exception Origin: ', {origin});
  logger.error('Uncaught Exception Error: ', {error});
  if (error && error.stack)
    logger.error('Uncaught Exception Stack: %s ', error.stack);
  if (server && server.listening) server.close();
  process.exit(1);
});

process.on('exit', (code) => {
  logger.error('Exit Code: ', {code});
});

server.on('listening', () => {
  debug('Feathers application started on http://%s:%d\n',app.get('host'),port);
});

server.on('error', (error) => {
  logger.error(`Error starting listener for Feathers application - ${error}`);
  if (server && server.listening) server.close();
  process.exit(1);
});
