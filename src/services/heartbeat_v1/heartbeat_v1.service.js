// Initializes the service
const serviceName = require('path').basename(__filename, '.service.js');
const serviceNameParts = serviceName.split('_');
const className = './' + serviceName + '.class';
const hooksName = './' + serviceName + '.hooks';
const docsName = './' + serviceName + '.docs';
const { ServiceClass } = require(className);
const hooks = require(hooksName);
const apppath = (process.env.APP_PATH.substr(0, 1) == '/' ? process.env.APP_PATH.substr(1) : process.env.APP_PATH);
const appUrl = `${apppath}/${serviceNameParts[1]}/${serviceNameParts[0]}`;

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate'),
    app,
  };

  const svc = new ServiceClass(options, app);

  const { ids, docs } = require(docsName);
  svc.id = ids;
  svc.docs = docs;

  // Initialize our service with any options it requires
  // Note: This starts with a /
  app.use(`/${appUrl}`, svc);

  // Get our initialized service so that we can register hooks
  // Note: This does not start with a /
  const service = app.service(`${appUrl}`);
  service.hooks(hooks);
};
