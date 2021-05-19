/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const debug = require('debug')(`${process.env.APP_NAME}:` + 'src:models:postgresservice.model:dbname');
const { logger } = require('cdcrhelpers');
//
// postgresservice-model.js - KnexJS
// 
// See http://knexjs.org/  for more of what you can do here.
// POSTGRES NOTE: All table and column names are forced to lowercase in all PG tools. So ONLY
// use lowercase table and column names in your queries.
module.exports = function (app) {
  const db = app.get('pgClient');
  const tableName = 'a_people';
  const schema = db.schema;
  schema.hasTable(tableName)
    .then(exists => {
      if (!exists) {
        db.schema.createTable(tableName, table => {
          table.increments('id');
          table.string('lastname');
          table.string('firstname');
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
