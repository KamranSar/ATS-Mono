// Initializes the `heartbeat_v1` service on path `/api/auth/v1/heartbeat`
const { HeartbeatV1 } = require('./heartbeat.class');
const hooks = require('./heartbeat.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  const svc = new HeartbeatV1(options, app);
  const { ids, docs } = require('./heartbeat.docs');
  svc.id = ids;
  svc.docs = docs;

  // Initialize our service with any options it requires
  app.use('/api/database/v1/heartbeat', svc);

  // Get our initialized service so that we can register hooks
  const service = app.service('api/database/v1/heartbeat');

  service.hooks(hooks);
};
