/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const debug = require('debug')('database-template:src:models:oracleservice_v1.0.model:dbname');
const { logger } = require('cdcrhelpers');
//
// oracleservice-model.js - KnexJS
// 
// See http://knexjs.org/  for more of what you can do here.
module.exports = function (app) {
  const db = app.get('oracleClient');
  const tableName = 'A_PEOPLE';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.increments('ID');
        table.string('LASTNAME');
        table.string('FIRSTNAME');
        table.timestamp('CREATEDAT').defaultTo(db.fn.now());
        table.timestamp('UPDATEDAT').defaultTo(db.fn.now());
      })
        .then(() => debug(`Created ${tableName} table`))
        .catch(e => logger.error(`Error creating ${tableName} table`, e));
    }
  });

  return db;
};
