// Initializes the `users` service on path `/users`
const { Users } = require('./users.class');
const createModel = require('../../models/users.model');
const hooks = require('./users.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    app
  };

  const svc = new Users(options, app);
  const { ids, docs } = require('./users.docs');
  svc.id = ids;
  svc.docs = docs;

  // Initialize our service with any options it requires
  app.use('/users', svc);

  // Get our initialized service so that we can register hooks
  const service = app.service('users');

  service.hooks(hooks);
};
