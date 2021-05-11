// Initializes the `oracleservice` service on path `/api/database/v1/oracleservice`
const { OracleserviceV1 } = require('./oracleservice.class');
const createModel = require('../../models/oracleservice.model');
const hooks = require('./oracleservice.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    app,
  };

  const svc = new OracleserviceV1(options, app);
  const { ids, docs } = require('./oracleservice.docs');
  svc.id = ids;
  svc.docs = docs;

  // Initialize our service with any options it requires
  app.use('/api/database/v1/oracleservice', svc);

  // Get our initialized service so that we can register hooks
  const service = app.service('api/database/v1/oracleservice');

  service.hooks(hooks);
};
