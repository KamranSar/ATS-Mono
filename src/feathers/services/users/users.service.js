import feathersClient from '@/feathers/index.js';

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
