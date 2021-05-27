import feathersClient from '@/config/private/feathers.js';
import { debug } from 'feathers-hooks-common';

const servicePath = 'api/auth/v1/example';
const service = feathersClient.service(servicePath);
service.hooks({
  before: {
    all: [debug('Hello World Example!')],
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
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
});

// Feathers Service
export default service;
