const { Service } = require('feathers-knex');

exports.ServiceClass = class ServiceClass extends Service {
  constructor(options, app) {
    super({
      ...options,
      name: 'a_people', // TODO: Change this to the database table name for your service and remove this comment
      id: 'id', // TODO: Change this to the database table primary key remove this comment
    });
    this.app = app;
  }
};
