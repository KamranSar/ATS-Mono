const dotenv = require('dotenv');
// Load env vars into app memory BEFORE adding/updating env vars because
// process.env vars that are set in the .env file vars can only be modified after
// calling dotenv.config() which loads them into memory.
dotenv.config();

// Set NODE_ENV (nodeenv) variable in case it's missing
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
// After loading env vars into app memory and IF in Production mode, then we must:
// 1) Delete the DEBUG var to ensure that all debug logging is disabled.
// 2) Disable default console logging to ensure that installed packages (i.e. redis)
//    follow the designed app logging requirements.
if (process.env.NODE_ENV === 'production') {
  delete process.env.DEBUG;
  console.log = function () {};
} else {
  // If the DEBUG variable is populated, then add this app to those requested if not already present.
  if (process.env.DEBUG && process.env.DEBUG.length > 1 && !process.env.DEBUG.includes(process.env.APP_NAME))
    process.env.DEBUG += `,${process.env.APP_NAME}:*`;
}

// Declare required packages, libraries and app components
const debug = require('debug')(`${process.env.APP_NAME}:` + 'src:app');
const path = require('path');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const cors = require('cors');
const { fileExists, logger, processSecrets } = require('cdcrhelpers');
const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');
const authentication = require('./authentication');
const mongoose = require('./mongoose');
const mongodb = require('./mongodb');
const mtmongodb = require('./mtmongodb');
// const knex = require('./knex');
// const sequelize = require('./sequelize');
const redis = require('./redis');
const openapi = require('./openapi');
const distribution = require('@kalisio/feathers-distributed');

// Create the app object
const app = express(feathers());
debug('Node Environment: ' + app.get('env'));

// Load all secrets if present
processSecrets();

// Load app configuration (default.json, test.json, or production.json)
app.configure(configuration());

// Enable security, CORS, favicon and body parsing
// https://content-security-policy.com/
// https://www.npmjs.com/package/helmet
// https://www.w3.org/TR/CSP3/
const allowedList = app.get('helmet').contentSecurityPolicy.allowedList;
const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': allowedList,
      'script-src-attr': allowedList,
      'connect-src': allowedList,
    },
  },
};

debug('Helmet config\n' + JSON.stringify(helmetOptions, null, 2));
app.use(helmet(helmetOptions));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers (databases)
app.configure(express.rest());
app.configure(
  socketio({
    // support for React Native applications so they don't time out
    pingInterval: 10000,
    pingTimeout: 50000,
  })
);
const { disableInternalServiceCalls } = require('cdcrhooks');
app.configure(
  distribution({
    hooks: {
      before: {
        all: [
          // Don't allow external calls to internal API's.
          disableInternalServiceCalls(),
        ],
      },
    },
    middlewares: {
      before: (req, res, next) => next(),
      after: express.errorHandler(),
    },
    key: process.env.APP_NAME,
  })
);

app.configure(mongoose);
app.configure(mongodb);
app.configure(mtmongodb);
app.configure(redis);
// app.configure(knex);
// app.configure(sequelize);

// Load the OpenAPI specs
if (process.env.PUBLISH_DOCS && process.env.PUBLISH_DOCS.toLowerCase() === 'true') app.configure(openapi);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.errorHandler({ logger }));

// Configure global app hooks
app.hooks(appHooks);

debug(
  'Service Authorization is (%s)',
  require('./service-config').server.authActive === true ? 'ACTIVE' : 'DEACTIVATED'
);

// Set the gitInfo object in the application, if file exists
const fileName = 'gitInfo.js';
if (fileExists('./src/' + fileName)) {
  const gitInfo = require('./' + fileName);
  app.set('gitInfo', gitInfo);
}

module.exports = app;
