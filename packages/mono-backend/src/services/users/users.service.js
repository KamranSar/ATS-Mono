// Initializes the service
const serviceName = require('path').basename(__filename, '.service.js');
const className = './' + serviceName + '.class';
const hooksName = './' + serviceName + '.hooks';
const { ServiceClass } = require(className);
const hooks = require(hooksName);

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate'),
  };

  const svc = new ServiceClass(options, app);

  // Initialize our service with any options it requires
  // Note: This starts with a /
  app.use(`/internal/${serviceName}`, svc);

  // Get our initialized service so that we can register hooks
  // Note: This does not start with a /
  const service = app.service(`internal/${serviceName}`);
  service.hooks(hooks);
};
