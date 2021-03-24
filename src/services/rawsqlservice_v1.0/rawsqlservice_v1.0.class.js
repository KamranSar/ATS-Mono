/* eslint-disable no-unused-vars */
const {runQuery} = require('./rawsqlservice_v1.0.impl.js');

exports.RawsqlserviceV10 = class RawsqlserviceV10 {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    return await runQuery(this.options, params);
  }
};
