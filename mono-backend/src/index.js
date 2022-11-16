const serverData = require('./service-config').server;

// Server parameters go into process env
process.env.APP_NAME = serverData.name;
process.env.APP_PATH = serverData.appPath;
process.env.APP_DESCRIPTION = serverData.description;
process.env.APP_RELEASE = serverData.release;
process.env.DOCS_PATH = serverData.docsPath;

const app = require('./app');
const debug = require('debug')(`${process.env.APP_NAME}` + ':src:index');
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

process.on('unhandledRejection', error => {
  logger.error('Unhandled Rejection Error:  ', error);
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
