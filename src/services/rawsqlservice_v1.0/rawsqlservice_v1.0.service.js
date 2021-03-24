// Initializes the `rawsqlservice_v1.0` service on path `/api/database/v1.0/rawsqlservice`
const { RawsqlserviceV10 } = require('./rawsqlservice_v1.0.class');
const hooks = require('./rawsqlservice_v1.0.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate'),
    app,
  };

  const svc = new RawsqlserviceV10(options, app);
  const { ids, docs } = require('./rawsqlservice_v1.0.docs');
  svc.id = ids;
  svc.docs = docs;

  // Initialize our service with any options it requires
  app.use('/api/database/v1.0/rawsqlservice', svc);

  // Get our initialized service so that we can register hooks
  const service = app.service('api/database/v1.0/rawsqlservice');

  service.hooks(hooks);
};
