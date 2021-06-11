import feathersClient from '@/feathers/index.js';
import { debug } from 'feathers-hooks-common';
const servicePath = 'api/auth/v1/heartbeat';

const service = feathersClient.service(servicePath);
service.hooks({
  before: {
    all: [debug('Hello world!')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [debug('Goodbye world!')],
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
});

export default service;
