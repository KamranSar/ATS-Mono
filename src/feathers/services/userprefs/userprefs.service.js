import feathersClient from '@/feathers/index.js';
const servicePath = 'api/auth/v1/userprefs';
import myApp from '@/config/myApp.js';

const service = feathersClient.service(servicePath);
service.hooks({
  before: {
    all: [
      (context) => {
        console.log(context);
        context.params.query = {
          appid: myApp.cdcrAppID,
        };
        return context;
      },
    ],
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

export default service;
