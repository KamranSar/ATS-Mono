// https://vuex.feathersjs.com/getting-started.html#service-plugins

import feathersClient, {
  makeServicePlugin,
  BaseModel,
} from '@/config/private/feathers';

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
      _id: '',
      objectSid: '',
      azureLocalAccountId: '',
      tenantId: '',
      username: '',
      firstname: '',
      lastname: '',
      displayname: '',
      email: '',
      lastloginstrategy: '',
      disabled: true,
      logincount: 0,
      lastloginipaddress: '',
      prevloginipaddress: '',
    };
  }
}

const getters = {
  isOrgAdmin(state) {
    return !!state.User && state.User.role && state.User.role === 'admin';
  },
};

// Set up the service name and plugin
// https://vuex.feathersjs.com/service-plugin.html#configuration
const servicePath = 'api/auth/v1/users'; // The Vuex namespace
const servicePlugin = makeServicePlugin({
  namespace: 'Users',
  Model: User,
  idField: '_id',
  service: feathersClient.service(servicePath),
  servicePath: servicePath,
  getters: getters,
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
export { servicePath };
