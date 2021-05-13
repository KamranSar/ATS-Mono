/* eslint-disable no-unused-vars */
const { getUptime } = require('cdcrhelpers');
exports.ServiceClass = class ServiceClass {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
  }

  async find(params) {
    return getUptime();
  }

};
