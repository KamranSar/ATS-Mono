const { Service } = require('feathers-knex');

exports.ServiceClass = class ServiceClass extends Service {
  constructor(options, app) {
    super({
      ...options,
      name: 'a_people',
      id: 'id',
    });
    this.app = app;
  }
};
