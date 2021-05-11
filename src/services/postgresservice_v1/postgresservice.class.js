const debug = require('debug')(`${process.env.APP_NAME}:` + 'src:services:postgresservice_v1:postgresservice.class');
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
