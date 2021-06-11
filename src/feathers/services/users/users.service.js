import feathersClient from '@/feathers/index.js';
import { getUserRoles } from '@/feathers/services/users/users.hooks.js';

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
    find: [getUserRoles],
    get: [getUserRoles],
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
