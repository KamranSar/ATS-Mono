// Initializes the `heartbeat_v1.0` service on path `/api/auth/v1.0/heartbeat`
const { HeartbeatV10 } = require('./heartbeat_v1.0.class');
const hooks = require('./heartbeat_v1.0.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  const svc = new HeartbeatV10(options, app);
  const { ids, docs } = require('./heartbeat_v1.0.docs');
  svc.id = ids;
  svc.docs = docs;

  // Initialize our service with any options it requires
  app.use('/api/database/v1.0/heartbeat', svc);

  // Get our initialized service so that we can register hooks
  const service = app.service('api/database/v1.0/heartbeat');

  service.hooks(hooks);
};
