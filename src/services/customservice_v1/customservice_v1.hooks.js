const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff, disallow, isProvider } = require('feathers-hooks-common');
const checkPermissions = require('feathers-permissions');
const { logSvcMsg, fixQueryType } = require('cdcrhooks');
const server = require('../../index.json').server;
const authActive = process.env.NODE_ENV != 'development' || server.authActive ? true : false;

module.exports = {
  before: {
    all: [
      iff(authActive, authenticate('jwt')),
      logSvcMsg(),
      iff(
        authActive,
        checkPermissions({
          roles: (context) => [context.path],
          entity: 'apiperms',
        })
      ),
    ],
    find: [
      // Convert data types from strings back to proper data type
      // web sockets and internal calls send the data in the correct form.
      // Only REST calls are in string format due to being on the URL (as strings)
      iff(
        isProvider('rest'),
        fixQueryType('some_boolean_field', 'Boolean'),
        fixQueryType('some_number_field', 'Number'),
        fixQueryType('some_nullable_field', 'Null')
      ),
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [disallow()],
  },

  after: {
    all: [logSvcMsg()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
