import feathersClient from '@/config/private/feathers.js';
// import { debug } from 'feathers-hooks-common';

const servicePath = 'api/auth/v1/users';
const service = feathersClient.service(servicePath);
service.hooks({
  before: {
    all: [],
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
