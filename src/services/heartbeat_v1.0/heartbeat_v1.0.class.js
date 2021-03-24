/* eslint-disable no-unused-vars */
const { getUptime } = require('cdcrhelpers');
exports.HeartbeatV10 = class HeartbeatV10 {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    return getUptime();
  }

};
