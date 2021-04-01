const dotenv = require('dotenv');
// Load env vars into app memory BEFORE adding/updating env vars because
// process.env vars that are set in the .env file can only be modified after 
// calling dotenv.config() which loads them into memory.
dotenv.config();

// Set NODE_ENV (nodeenv) variable in case it's missing
process.env.NODE_ENV = (process.env.NODE_ENV) ? (process.env.NODE_ENV) : 'development';
// After loading env vars into app memory and IF in Production mode, then we must:
// 1) Delete the DEBUG var to ensure that all debug logging is disabled.
// 2) Disable default console logging to ensure that installed packages (i.e. redis) 
//    follow the designed app logging requirements.
if (process.env.NODE_ENV==='production') {
  delete process.env.DEBUG;
  console.log = function() {};
}
else {
  // If the DEBUG variable is populated, then add this app to those requested.
  if (process.env.DEBUG && process.env.DEBUG.length > 1)
    process.env.DEBUG += `,${process.env.APP_NAME}:*`;
}

const debug = require('debug')(`${process.env.APP_NAME}:`+'src:app');
const path = require('path');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const cors = require('cors');
const { logger } = require('cdcrhelpers');
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
const mongooseMidTier = require('./mongoosemidtier');
const mongodb = require('./mongodb');
const mongodbMidTier = require('./mongodbmidtier');
const knex = require('./knex');
const redis = require('./redis');
const openapi = require('./openapi');

const app = express(feathers());
debug('Node Environment: ' + app.get('env'));

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
  }
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
app.configure(socketio());
app.configure(mongoose);
app.configure(mongooseMidTier);
app.configure(mongodb);
app.configure(mongodbMidTier);
app.configure(redis);
app.configure(knex);

// Load the OpenAPI specs
app.configure(openapi);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

module.exports = app;
