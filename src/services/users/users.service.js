// Initializes the service
const serviceName = require('path').basename(__filename, '.service.js');
const className = './' + serviceName + '.class';
const hooksName = './' + serviceName + '.hooks';
const modelName = '../../models/' + serviceName + '.model';
const createModel = require(modelName);
const service = require('../../index.json').services.find( obj => {return obj.name == serviceName});
const { ServiceClass } = require(className);
const hooks = require(hooksName);

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  };

  const svc = new ServiceClass(options, app);

  // Initialize our service with any options it requires
  // Note: This starts with a /
  app.use(`/${service.endpoint}`, svc);

  // Get our initialized service so that we can register hooks
  // Note: This does not start with a /
  const lservice = app.service(`${service.endpoint}`);
  lservice.hooks(hooks);
};
