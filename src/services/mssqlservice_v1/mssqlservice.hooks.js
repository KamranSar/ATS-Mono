const { authenticate } = require('@feathersjs/authentication').hooks;
const redisCache = require('feathers-redis-cache').hooks;
const { setNow } = require('feathers-hooks-common');
const { logSvcMsg, setUserID } = require('cdcrhooks');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      logSvcMsg()
    ],
    find: [redisCache.before()],
    get: [redisCache.before()],
    create: [setUserID('updatedby'), setNow('createdat'), setNow('updatedat')],
    update: [setUserID('updatedby'), setNow('updatedat')],
    patch: [setUserID('updatedby'), setNow('updatedat')],
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
