// Initializes the `postgresservice` service on path `/api/database/v1/postgresservice`
const { PostgresserviceV1 } = require('./postgresservice.class');
const createModel = require('../../models/postgresservice.model');
const hooks = require('./postgresservice.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  const svc = new PostgresserviceV1(options, app);
  const { ids, docs } = require('./postgresservice.docs');
  svc.id = ids;
  svc.docs = docs;

  // Initialize our service with any options it requires
  app.use('/api/database/v1/postgresservice', svc);

  // Get our initialized service so that we can register hooks
  const service = app.service('api/database/v1/postgresservice');

  service.hooks(hooks);
};
