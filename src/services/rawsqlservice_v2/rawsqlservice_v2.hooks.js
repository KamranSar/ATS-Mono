const { authenticate } = require('@feathersjs/authentication').hooks;
const redisCache = require('feathers-redis-cache').hooks;
const { disallow, iff } = require('feathers-hooks-common');
const checkPermissions = require('feathers-permissions');
const { logSvcMsg } = require('cdcrhooks');
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
    create: [disallow()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()],
  },

  after: {
    all: [logSvcMsg()],
    find: [
      redisCache.after({ expiration: 600 }) // 10 minutes
    ],
    get: [
      redisCache.after({ expiration: 600 }) // 10 minutes
    ],
    create: [],
    update: [],
    patch: [],
    remove: []
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
