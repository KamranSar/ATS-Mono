const { authenticate } = require('@feathersjs/authentication').hooks;
const { disallow, iff, isProvider, discard } = require('feathers-hooks-common');
const redisCache = require('feathers-redis-cache').hooks;
const { logSvcMsg } = require('cdcrhooks');

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt'), logSvcMsg(), iff(isProvider('external'), disallow()), redisCache.before()],
    get: [authenticate('jwt'), logSvcMsg(), iff(isProvider('external'), disallow()), redisCache.before()],
    create: [disallow()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // MUST always be the last hook!
      discard('password'),
      logSvcMsg(),
    ],
    find: [redisCache.after({ expiration: 60 * 60 * 4 })],
    get: [redisCache.after({ expiration: 60 * 60 * 4 })],
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
