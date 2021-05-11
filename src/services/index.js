//
// Automatically load the services
//
const server = require('../index.json');

function load (app) {

  for (const service in server.services) {

    if (server.services[service].enabled) {
      
      const url = (server.services[service].version) ? 
            require(`./${server.services[service].name}_${server.services[service].version}/${server.services[service].name}.service.js`) : 
            require(`./${server.services[service].name}/${server.services[service].name}.service.js`);
      app.configure(url);

    }

  }

}

module.exports = function (app) {
  
  load (app);

};
