// Initializes the service
const serviceName = require('path').basename(__filename, '.service.js');
const className = './' + serviceName + '.class';
const hooksName = './' + serviceName + '.hooks';
const docsName = './' + serviceName + '.docs';

const service = require('../../index.json').services.find( obj => {return obj.name == serviceName});

const apppath = (process.env.APP_PATH.substr(0, 1) == '/' ? process.env.APP_PATH.substr(1) : process.env.APP_PATH);
const docspath = process.env.DOCS_PATH;

const appUrl = `${apppath}/${service.version}/${service.endpoint}`;

const { ServiceClass } = require(className);
const hooks = require(hooksName);

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
