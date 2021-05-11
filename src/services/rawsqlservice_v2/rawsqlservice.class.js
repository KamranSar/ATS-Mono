/* eslint-disable no-unused-vars */
const { runQuery } = require('./rawsqlservice.impl.js');

exports.RawsqlserviceV2 = class RawsqlserviceV2 {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    return await runQuery(this.options, params);
  }
};
