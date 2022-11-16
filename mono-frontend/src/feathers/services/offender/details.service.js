import feathersClient from '@cdcr/vue-frontend/feathers/index.js';
import { WEB_SOCKETS_ENABLED } from '@/config/appFeatures';
const { alterItems } = require('feathers-hooks-common');

// If you've enabled sockets in myApp config...
// Toggle this to true or false to watch for service changes on the socket.
const watchForChangesOnSocket = true;

async function forceBoolean(input, fieldNames) {
  if (Array.isArray(input)) {
    return Promise.all(
      input.map((current) => forceBoolean(current, fieldNames))
    );
  }

  const data = JSON.parse(JSON.stringify(input)); // copy the input
  // console.log('forceBoolean(): input(before) => ', input);

  for (let field of fieldNames) {
    if (data.CaseFactors[0][field] !== undefined) {
      const val = data.CaseFactors[0][field];
      if (val) {
        if (typeof val === 'boolean') {
          // skip, already a boolean
        } else if (typeof val === 'string') {
          const valtmp = val.toLowerCase();
          const STR_TRUE = ['true', 'yes', 'y'];
          data.CaseFactors[0][field] = STR_TRUE.includes(valtmp); // `String.includes()` returns true or false as appropriate
        } else if (typeof val === 'number') {
          if (val) {
            data.CaseFactors[0][field] = Boolean(data[field]);
          }
        } else {
          data.CaseFactors[0][field] = false;
        }
      } else {
        data.CaseFactors[0][field] = false;
      }
    }
  }

  // console.log('forceBoolean(): data(After) => ', data);
  return data;
}

const booleanFields = [
  'lifer_lwop_flag',
  'sny_flag',
  'cccms_eop_flag',
  'cocci1_flag',
  'cocci2_flag',
  'dpp_flag',
  'ddp_flag',
  'ice_flag',
  'retainASU_flag',
  'transferMERD_flag',
];
const servicePath = 'api/cdcr/ats/v1/offender_detail';
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
    find: [
      alterItems((rec) => {
        rec = forceBoolean(rec, booleanFields);
        return rec;
      }),
    ],
    get: [
      alterItems((rec) => {
        rec = forceBoolean(rec, booleanFields);
        return rec;
      }),
    ],
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
