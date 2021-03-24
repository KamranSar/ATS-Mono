const users = require('./users/users.service.js');
const heartbeatV10 = require('./heartbeat_v1.0/heartbeat_v1.0.service.js');
const mssqlserviceV10 = require('./mssqlservice_v1.0/mssqlservice_v1.0.service.js');
const oracleserviceV10 = require('./oracleservice_v1.0/oracleservice_v1.0.service.js');
const postgresserviceV10 = require('./postgresservice_v1.0/postgresservice_v1.0.service.js');
const rawsqlserviceV10 = require('./rawsqlservice_v1.0/rawsqlservice_v1.0.service.js');
const rawsqlserviceV20 = require('./rawsqlservice_v2.0/rawsqlservice_v2.0.service.js');

module.exports = function (app) {
  app.configure(users);
  app.configure(heartbeatV10);
  app.configure(mssqlserviceV10);
  app.configure(oracleserviceV10);
  app.configure(postgresserviceV10);
  app.configure(rawsqlserviceV10);
  app.configure(rawsqlserviceV20);
};
