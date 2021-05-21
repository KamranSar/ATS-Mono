const { authenticate } = require('@feathersjs/authentication').hooks;
const redisCache = require('feathers-redis-cache').hooks;
const { discard, setNow, iff } = require('feathers-hooks-common');
const checkPermissions = require('feathers-permissions');
const { logSvcMsg, setUserIDAsString, fixOracleQueryParams } = require('cdcrhooks');
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
    find: [redisCache.before(), fixOracleQueryParams()],
    get: [redisCache.before()],
    create: [setUserIDAsString('UPDATEDBY'), setNow('CREATEDAT'), setNow('UPDATEDAT')],
    update: [setUserIDAsString('UPDATEDBY'), setNow('UPDATEDAT'), discard('CREATEDAT')],
    patch: [setUserIDAsString('UPDATEDBY'), setNow('UPDATEDAT'), discard('CREATEDAT')],
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
