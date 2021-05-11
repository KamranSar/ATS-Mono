// Initializes the `rawsqlservice_v2` service on path `/api/database/v2/rawsqlservice`
const { RawsqlserviceV2 } = require('./rawsqlservice.class');
const hooks = require('./rawsqlservice.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate'),
    app
  };

  const svc = new RawsqlserviceV2(options, app);
  const { ids, docs } = require('./rawsqlservice.docs');
  svc.id = ids;
  svc.docs = docs;

  // Initialize our service with any options it requires
  app.use('/api/database/v2/rawsqlservice', svc);

  // Get our initialized service so that we can register hooks
  const service = app.service('api/database/v2/rawsqlservice');

  service.hooks(hooks);
};
