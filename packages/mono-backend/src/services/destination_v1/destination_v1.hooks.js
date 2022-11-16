const { authenticate } = require('@feathersjs/authentication').hooks;
const redisCache = require('feathers-redis-cache').hooks;
const { discard, setNow, iff, isProvider } = require('feathers-hooks-common');
const checkPermissions = require('feathers-permissions');
const { logSvcMsg, setUserID, fixQueryType } = require('cdcrhooks');
const server = require('../../service-config').server;
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
      redisCache.before(),
    ],
    get: [redisCache.before()],
    create: [setUserID('updatedBy', 'createdBy'), setNow('createdAt'), setNow('updatedAt')],
    update: [setUserID('updatedBy'), setNow('updatedAt')],
    patch: [setUserID('updatedBy'), setNow('updatedAt'), discard('createdAt', 'createdBy')],
    remove: [],
  },

  after: {
    all: [logSvcMsg()],
    find: [
      redisCache.after({ expiration: 600 }), // 10 minutes
    ],
    get: [
      redisCache.after({ expiration: 600 }), // 10 minutes
    ],
    create: [redisCache.purge()],
    update: [redisCache.purge()],
    patch: [redisCache.purge()],
    remove: [redisCache.purge()],
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
