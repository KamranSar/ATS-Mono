const { Service } = require('feathers-knex');

exports.MssqlserviceV1 = class MssqlserviceV1 extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'A_PEOPLE',
      id: 'ID',
    });
  }
};
