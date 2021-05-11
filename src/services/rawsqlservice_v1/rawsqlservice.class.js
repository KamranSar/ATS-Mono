const serviceName = require('path').basename(__filename, '.class.js');
const {runQuery} = require(`./${serviceName}.impl.js`);

exports.ServiceClass = class ServiceClass {
  constructor (options, app) {
    this.options = options || {};
    this.app = app;
  }

  async find (params) {
    return await runQuery(this.options, params);
  }
};
