const users = require('./users/users.service.js');
const heartbeatV1 = require('./heartbeat_v1/heartbeat_v1.service.js');
const server = require('../service-config');

//
// Automatically load the services in the service-config.js file
//
function load(app) {

  for (const service of server.services) {
    if (service.enabled) {
      const url = require(`./${service.name}_${service.version}/${service.name}_${service.version}.service.js`);
      app.configure(url);
    }
  }

}

module.exports = function (app) {

  // Register Immutable services
  app.configure(users);
  app.configure(heartbeatV1);

  // Load/Register public Mutable services
  load(app);

};
