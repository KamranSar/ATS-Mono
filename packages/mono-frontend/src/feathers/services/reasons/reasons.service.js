import feathersClient from '@cdcr/vue-frontend/feathers/index.js';
import { WEB_SOCKETS_ENABLED } from '@/config/appFeatures.js';
// If you've enabled sockets in appFeatures...
// Toggle this to true or false to watch for service changes on the socket.
const watchForChangesOnSocket = true;

const servicePath = 'api/ats/v1/reason';
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

// Listen to socket events when available.
if (WEB_SOCKETS_ENABLED && watchForChangesOnSocket) {
  service.on('created', (item) => {
    console.log('Created: ', item);
  });
  service.on('updated', (item) => {
    console.log('Updated: ', item);
  });
  service.on('patched', (item) => {
    console.log('Patched: ', item);
  });
  service.on('removed', (item) => {
    console.log('Removed: ', item);
  });
}

// Feathers Service
export default service;
