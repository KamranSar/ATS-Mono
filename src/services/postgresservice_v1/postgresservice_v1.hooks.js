const { authenticate } = require('@feathersjs/authentication').hooks;
const redisCache = require('feathers-redis-cache').hooks;
const { discard, setNow, iff } = require('feathers-hooks-common');
const checkPermissions = require('feathers-permissions');
const { logSvcMsg, setUserIDAsString } = require('cdcrhooks');
const server = require('../../service-config').server;
const authActive = (process.env.NODE_ENV != 'development' || server.authActive) ? true : false;

module.exports = {
  before: {
    all: [
      iff(authActive, authenticate('jwt')),
      logSvcMsg(),
      iff(authActive, checkPermissions({
        roles: (context) => [context.path],
        entity: 'apiperms',
      })),
    ],
    find: [redisCache.before()],
    get: [redisCache.before()],
    create: [setUserIDAsString('updatedby'), setNow('createdat'), setNow('updatedat')],
    update: [setUserIDAsString('updatedby'), setNow('updatedat'), discard('createdat')],
    patch: [setUserIDAsString('updatedby'), setNow('updatedat'), discard('createdat')],
    remove: []
  },

  after: {
    all: [logSvcMsg()],
    find: [
      redisCache.after({ expiration: 600 }) // 10 minutes
    ],
    get: [
      redisCache.after({ expiration: 600 }) // 10 minutes
    ],
    create: [redisCache.purge()],
    update: [redisCache.purge()],
    patch: [redisCache.purge()],
    remove: [redisCache.purge()]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
