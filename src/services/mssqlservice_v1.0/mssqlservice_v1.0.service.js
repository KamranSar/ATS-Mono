// Initializes the `mssqlservice` service on path `/api/database/v1.0/mssqlservice`
const { MssqlserviceV10 } = require('./mssqlservice_v1.0.class');
const createModel = require('../../models/mssqlservice_v1.0.model');
const hooks = require('./mssqlservice_v1.0.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    app
  };

  const svc = new MssqlserviceV10(options, app);
  const { ids, docs } = require('./mssqlservice_v1.0.docs');
  svc.id = ids;
  svc.docs = docs;

  // Initialize our service with any options it requires
  app.use('/api/database/v1.0/mssqlservice', svc);

  // Get our initialized service so that we can register hooks
  const service = app.service('api/database/v1.0/mssqlservice');

  service.hooks(hooks);
};
