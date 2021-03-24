const { Service } = require('feathers-knex');

exports.MssqlserviceV10 = class MssqlserviceV10 extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'A_PEOPLE',
      id: 'ID',
    });
  }
};
