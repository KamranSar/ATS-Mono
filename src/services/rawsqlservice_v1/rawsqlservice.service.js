// Initializes the `rawsqlservice_v1` service on path `/api/database/v1/rawsqlservice`
const { RawsqlserviceV1 } = require('./rawsqlservice.class');
const hooks = require('./rawsqlservice.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate'),
    app,
  };

  const svc = new RawsqlserviceV1(options, app);
  const { ids, docs } = require('./rawsqlservice.docs');
  svc.id = ids;
  svc.docs = docs;

  // Initialize our service with any options it requires
  app.use('/api/database/v1/rawsqlservice', svc);

  // Get our initialized service so that we can register hooks
  const service = app.service('api/database/v1/rawsqlservice');

  service.hooks(hooks);
};
