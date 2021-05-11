/* eslint-disable no-unused-vars */
const { iff } = require('feathers-hooks-common');
const { logSvcError } = require('cdcrhelpers');
const { addServiceTime, hasAccessToken, decodeToken } = require('cdcrhooks');

// Application hooks that run for every service
module.exports = {
  before: {
    all: [addServiceTime(), iff(hasAccessToken(), decodeToken())],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [
      async (context) => {
        logSvcError(context);
        return context;
      },
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
