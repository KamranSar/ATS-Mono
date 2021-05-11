// Initializes the `users` service on path `/users`
const { Users } = require('./users.class');
const createModel = require('../../models/users.model');
const hooks = require('./users.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  };

  const svc = new Users(options, app);

  // Initialize our service with any options it requires
  app.use('/internal/users', svc);

  // Get our initialized service so that we can register hooks
  const service = app.service('internal/users');

  service.hooks(hooks);
};
