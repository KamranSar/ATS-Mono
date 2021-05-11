/* eslint-disable no-unused-vars */
const { getUptime } = require('cdcrhelpers');
exports.HeartbeatV1 = class HeartbeatV1 {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    return getUptime();
  }

};
