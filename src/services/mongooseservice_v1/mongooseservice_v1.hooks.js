const { authenticate } = require('@feathersjs/authentication').hooks;
const redisCache = require('feathers-redis-cache').hooks;
const { discard, setNow, iff, disallow } = require('feathers-hooks-common');
const checkPermissions = require('feathers-permissions');
const { logSvcMsg, setUserIDAsString } = require('cdcrhooks');
const server = require('../../index.json').server;
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
    create: [setUserIDAsString('updatedBy'), setNow('createdAt'), setNow('updatedAt')],
    update: [setUserIDAsString('updatedBy'), setNow('updatedAt'), discard('createdAt')],
    patch: [setUserIDAsString('updatedBy'), setNow('updatedAt'), discard('createdAt')],
    remove: [disallow()]
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
