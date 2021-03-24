// Initializes the `postgresservice` service on path `/api/database/v1.0/postgresservice`
const { PostgresserviceV10 } = require('./postgresservice_v1.0.class');
const createModel = require('../../models/postgresservice_v1.0.model');
const hooks = require('./postgresservice_v1.0.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  const svc = new PostgresserviceV10(options, app);
  const { ids, docs } = require('./postgresservice_v1.0.docs');
  svc.id = ids;
  svc.docs = docs;

  // Initialize our service with any options it requires
  app.use('/api/database/v1.0/postgresservice', svc);

  // Get our initialized service so that we can register hooks
  const service = app.service('api/database/v1.0/postgresservice');

  service.hooks(hooks);
};
