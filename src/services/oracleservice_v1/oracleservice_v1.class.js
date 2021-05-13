const { Service } = require('feathers-knex');

exports.ServiceClass = class ServiceClass extends Service {
  constructor(options, app) {
    super({
      ...options,
      name: 'A_PEOPLE',
      id: 'ID'
    });
    this.app = app;
  }
};
