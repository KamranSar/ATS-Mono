/* eslint-disable no-unused-vars */
const debug = require('debug')('database-template:src:app.hooks');
const { logSvcError } = require('cdcrhelpers');
const { addServiceTime } = require('cdcrhooks');

// Application hooks that run for every service
module.exports = {
  before: {
    all: [addServiceTime()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [
      async context => {
        logSvcError(context);
        return context;
      }
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
