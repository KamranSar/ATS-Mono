const { authenticate } = require('@feathersjs/authentication').hooks;
const redisCache = require('feathers-redis-cache').hooks;
const { discard, setNow } = require('feathers-hooks-common');
const checkPermissions = require('feathers-permissions');
const { logSvcMsg, fixOracleQueryParams, setUserIDAsString } = require('cdcrhooks');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      logSvcMsg(),
      checkPermissions({
        roles: (context) => [context.path],
        entity: 'apiperms',
      }),
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
