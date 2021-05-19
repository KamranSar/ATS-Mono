const { authenticate } = require('@feathersjs/authentication').hooks;
const redisCache = require('feathers-redis-cache').hooks;
const { discard, setNow } = require('feathers-hooks-common');
const checkPermissions = require('feathers-permissions');
const { logSvcMsg, setUserID } = require('cdcrhooks');

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
    find: [redisCache.before()],
    get: [redisCache.before()],
    create: [setNow('CREATEDAT'), setNow('UPDATEDAT')],
    update: [setNow('UPDATEDAT'), discard('CREATEDAT')],
    patch: [setNow('UPDATEDAT'), discard('CREATEDAT')],
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
