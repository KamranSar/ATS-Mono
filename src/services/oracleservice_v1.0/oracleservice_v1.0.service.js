// Initializes the `oracleservice` service on path `/api/database/v1.0/oracleservice`
const { OracleserviceV10 } = require('./oracleservice_v1.0.class');
const createModel = require('../../models/oracleservice_v1.0.model');
const hooks = require('./oracleservice_v1.0.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    app,
  };

  const svc = new OracleserviceV10(options, app);
  const { ids, docs } = require('./oracleservice_v1.0.docs');
  svc.id = ids;
  svc.docs = docs;

  // Initialize our service with any options it requires
  app.use('/api/database/v1.0/oracleservice', svc);

  // Get our initialized service so that we can register hooks
  const service = app.service('api/database/v1.0/oracleservice');

  service.hooks(hooks);
};
