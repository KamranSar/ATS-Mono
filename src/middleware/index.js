const { logResponseTimeAndSvcStats } = require('cdcrhelpers');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.use(logResponseTimeAndSvcStats(app));
};
