const users = require('./users/users.service.js');
const heartbeatV1 = require('./heartbeat_v1/heartbeat_v1.service.js');
const server = require('../index.json');

//
// Automatically load the services driven by index.json file
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

  // Load/Register public services that may change over time
  load(app);

};
