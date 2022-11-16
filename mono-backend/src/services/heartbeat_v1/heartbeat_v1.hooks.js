const { logSvcMsg } = require('cdcrhooks');
const { disallow } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [logSvcMsg()],
    find: [],
    get: [disallow()],
    create: [disallow()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()],
  },

  after: {
    all: [logSvcMsg()],
    find: [],
    get: [],
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
