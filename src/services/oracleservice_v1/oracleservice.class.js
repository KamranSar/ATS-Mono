const { Service } = require('feathers-knex');

exports.OracleserviceV1 = class OracleserviceV1 extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'A_PEOPLE',
      id: 'ID'
    });
  }
};
