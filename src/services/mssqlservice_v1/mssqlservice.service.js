// Initializes the `mssqlservice` service on path `/api/database/v1/mssqlservice`
const { MssqlserviceV1 } = require('./mssqlservice.class');
const createModel = require('../../models/mssqlservice.model');
const hooks = require('./mssqlservice.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    app
  };

  const svc = new MssqlserviceV1(options, app);
  const { ids, docs } = require('./mssqlservice.docs');
  svc.id = ids;
  svc.docs = docs;

  // Initialize our service with any options it requires
  app.use('/api/database/v1/mssqlservice', svc);

  // Get our initialized service so that we can register hooks
  const service = app.service('api/database/v1/mssqlservice');

  service.hooks(hooks);
};
