// Initializes the service
const serviceName = require('path').basename(__filename, '.service.js');
const className = './' + serviceName + '.class';
const hooksName = './' + serviceName + '.hooks';
const docsName = './' + serviceName + '.docs';
const service = require('../../service-config').services.find((obj) => {
  return obj.name + '_' + obj.version == serviceName;
});
const apppath = process.env.APP_PATH.substring(0, 1) == '/' ? process.env.APP_PATH.substring(1) : process.env.APP_PATH;
const appUrl = `${apppath}/${service.version}/${service.name}`;
const { ServiceClass } = require(className);
const hooks = require(hooksName);

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate'),
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
