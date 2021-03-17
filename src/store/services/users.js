// https://vuex.feathersjs.com/getting-started.html#service-plugins

import feathersClient, {
  makeServicePlugin,
  BaseModel,
} from '@/feathers-client';

/**
 * User Model Class
 */
class User extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'User';
  // Define default properties here - match the model on the server side
  static instanceDefaults() {
    return {
      objectSid: '',
      azureAccountId: '',
      tenantId: '',
      username: '',
      firstname: '',
      lastname: '',
      displayname: '',
      email: '',
      lastloginstrategy: '',
      password: '',
      role: '',
      disabled: false,
      logincount: 0,
      lastloginipaddress: '',
      prevloginipaddress: '',
    };
  }
}

// Set up the service name and plugin
// https://vuex.feathersjs.com/service-plugin.html#configuration
const servicePath = 'api/auth/v1.0/users';
const servicePlugin = makeServicePlugin({
  Model: User,
  idField: '_id',
  service: feathersClient.service(servicePath),
  servicePath,
  namespace: null,
});

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
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

export default servicePlugin;
