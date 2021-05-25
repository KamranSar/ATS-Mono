import feathersClient from '@/config/private/feathers.js';
// import { debug } from 'feathers-hooks-common';
import { getUserRoles } from '@/feathers/services/users/users.hooks.js';
import getNewToken from '@/feathers/hooks/getNewToken.js';

const servicePath = 'api/auth/v1/users';
const service = feathersClient.service(servicePath);
service.hooks({
  before: {
    all: [getNewToken],
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
