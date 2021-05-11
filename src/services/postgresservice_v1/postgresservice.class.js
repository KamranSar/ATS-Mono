const debug = require('debug')(`${process.env.APP_NAME}:` + 'src:services:postgresservice_v1:postgresservice_v1.class');
const { Service } = require('feathers-knex');

exports.PostgresserviceV1 = class PostgresserviceV1 extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'a_people',
      id: 'id',
    });
  }
};
