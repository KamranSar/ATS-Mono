const debug = require('debug')('database-template:src:services:postgresservice_v1.0:postgresservice_v1.0.class');
const { Service } = require('feathers-knex');

exports.PostgresserviceV10 = class PostgresserviceV10 extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'a_people',
      id: 'id',
    });
  }
};
