const users = require('./users/users.service.js');
const heartbeatV1 = require('./heartbeat_v1/heartbeat.service.js');
const mssqlserviceV1 = require('./mssqlservice_v1/mssqlservice.service.js');
const oracleserviceV1 = require('./oracleservice_v1/oracleservice.service.js');
const postgresserviceV1 = require('./postgresservice_v1/postgresservice.service.js');
const rawsqlserviceV1 = require('./rawsqlservice_v1/rawsqlservice.service.js');
const rawsqlserviceV2 = require('./rawsqlservice_v2/rawsqlservice.service.js');

module.exports = function (app) {
  app.configure(users);
  app.configure(heartbeatV1);
  app.configure(mssqlserviceV1);
  app.configure(oracleserviceV1);
  app.configure(postgresserviceV1);
  app.configure(rawsqlserviceV1);
  app.configure(rawsqlserviceV2);
};
