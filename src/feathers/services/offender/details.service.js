import feathersClient from '@/feathers/index.js';
import { debug } from 'feathers-hooks-common';
import myApp from '@/config/myApp.js';

// If you've enabled sockets in myApp config...
// Toggle this to true or false to watch for service changes on the socket.
const watchForChangesOnSocket = true;
import { offenderdetailHook } from '@/feathers/services/offender/details.hooks.js';

const servicePath = 'api/cdcr/ats/v1/offenderdetail';
const service = feathersClient.service(servicePath);
service.hooks({
  before: {
    all: [debug('offenderdetail Service!'), offenderdetailHook],
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
if (myApp.useWebSocketConnection && watchForChangesOnSocket) {
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
