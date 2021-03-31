const { logResponseTimeAndSvcStats } = require('cdcrhelpers');
const { TransactionIDHeader } = require('cdcr-remote-service');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.use(TransactionIDHeader());
  app.use(logResponseTimeAndSvcStats(app));
};
