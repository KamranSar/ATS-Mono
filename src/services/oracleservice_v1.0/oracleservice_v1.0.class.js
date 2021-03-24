const { Service } = require('feathers-knex');

exports.OracleserviceV10 = class OracleserviceV10 extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'A_PEOPLE',
      id: 'ID'
    });
  }
};
