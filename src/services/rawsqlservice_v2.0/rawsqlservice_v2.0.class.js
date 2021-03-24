/* eslint-disable no-unused-vars */
const {runQuery} = require('./rawsqlservice_v2.0.impl.js');

exports.RawsqlserviceV20 = class RawsqlserviceV20 {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    return await runQuery(this.options, params);
  }
};
