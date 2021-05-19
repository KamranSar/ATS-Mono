/* eslint-disable no-console */
const debug = require('debug')(`${process.env.APP_NAME}:` + 'src:models:mssqlservice.model:dbname');
const { logger } = require('cdcrhelpers');
//
// mssqlservice-model.js - KnexJS
// 
// See http://knexjs.org/  for more of what you can do here.
module.exports = function (app) {
  const db = app.get('mssqlClient');
  const tableName = 'a_people';
  const schema = db.schema;
  schema.hasTable(tableName)
    .then(exists => {
      if (!exists) {
        db.schema.createTable(tableName, table => {
          table.increments('id');
          table.string('lastname');
          table.string('firstname');
          table.string('location');
          table.timestamp('createdat').defaultTo(db.fn.now());
          table.timestamp('updatedat').defaultTo(db.fn.now());
          table.string('updatedby').defaultTo('NO_ID');
        })
          .then(() => debug(`Created ${tableName} table`))
          .catch(e => logger.error(`Error creating ${tableName} table`, e));
      }
    });

  return db;
};
