/* eslint-disable no-unused-vars */
const debug = require('debug')(`${process.env.APP_NAME}:` + 'src:knex:dbname');
const { logger } = require('cdcrhelpers');
const knex = require('knex');
const serverData = require('./service-config').server;

module.exports = function (app) {
  // MS-SQL connection
  if (serverData.mssqlEnabled) {
    const { connection, pool, connTimeout } = app.get('mssql');
    const connInfo = `MS-SQL server for (${connection.database}) database at: ${connection.server}:${connection.options.port}`;
    debug(`Connecting to ${connInfo}...`);
    const dbMssql = knex({ client: 'mssql', connection, pool, acquireConnectionTimeout: connTimeout });
    // Test the connection
    let mssql = { max: 11, errcnt: 0, connected: false, timeout: 2000 };
    for (let i = 0; !mssql.connected && i <= mssql.max; ++i) {
      setTimeout(() => {
        if (!mssql.connected) {
          dbMssql
            .raw('select 1+1 as result')
            .then(() => {
              debug(`Successfully connected to ${connInfo}`);
              mssql.connected = true;
            })
            .catch((error) => {
              logger.error('Connection error #%d at %s - ', ++mssql.errcnt, connInfo, { error });
              if (mssql.errcnt == mssql.max) process.exit(1);
            });
        }
      }, mssql.timeout * i);
    }

    app.set('mssqlClient', dbMssql);
  }

  // Oracle connection
  if (serverData.oracleEnabled) {
    const { connection, pool, connTimeout } = app.get('oracledb');
    const connInfo = `Oracle server at: ${connection.connectString}`;
    debug(`Connecting to ${connInfo}...  `);
    const dbOracle = knex({
      client: 'oracledb',
      native: false,
      connection,
      pool,
      acquireConnectionTimeout: connTimeout,
    });
    // Test the connection
    let oracle = { max: 21, errcnt: 0, connected: false, timeout: 10000 };
    for (let i = 0; !oracle.connected && i <= oracle.max; ++i) {
      setTimeout(() => {
        if (!oracle.connected) {
          // Test if connected by sending a server check
          dbOracle
            .raw('select 1+1 as result from DUAL')
            .then(() => {
              debug(`Successfully connected to ${connInfo}`);
              oracle.connected = true;
            })
            .catch((error) => {
              logger.error('Connection error #%d at %s - ', ++oracle.errcnt, connInfo, { error });
              if (oracle.errcnt == oracle.max) process.exit(1);
            });
        }
      }, oracle.timeout * i);
    }

    app.set('oracleClient', dbOracle);

    // Once connected, keep the connection alive with a periodic server check
    const serverHeartbeatMS = 60 * 60 * 1000; // 60 minutes
    setInterval(() => {
      if (oracle.connected) {
        dbOracle
          .raw('select 1+1 as result from DUAL')
          .then(() => {
            debug(`Keepalive successfully sent to ${connInfo}`);
          })
          .catch((error) => {
            logger.error('Keepalive error %s - ', connInfo, { error });
          });
      }
    }, serverHeartbeatMS);
  }

  // Postgres connection
  if (serverData.postgresEnabled) {
    const { connection, pool, connTimeout } = app.get('postgres');
    const connInfo = `Postgres SQL server for (${connection.database}) database at: ${connection.server}:${connection.options.port}`;
    debug(`Connecting to ${connInfo}...`);
    const connString = `postgresql://${connection.user}:${connection.password}@${connection.server}:${connection.options.port}/${connection.database}`;
    const dbPostgres = knex({ client: 'pg', connection: connString, pool, acquireConnectionTimeout: connTimeout });
    // Test the connection
    let postgres = { max: 6, errcnt: 0, connected: false, timeout: 2000 };
    for (let i = 0; !postgres.connected && i <= postgres.max; ++i) {
      setTimeout(() => {
        if (!postgres.connected) {
          dbPostgres
            .raw('SET timezone = "UTC";')
            .then(() => {
              debug(`Successfully connected to ${connInfo}`);
              postgres.connected = true;
            })
            .catch((error) => {
              logger.error('Connection error #%d at %s - ', ++postgres.errcnt, connInfo, { error });
              if (postgres.errcnt == postgres.max) process.exit(1);
            });
        }
      }, postgres.timeout * i);
    }
    app.set('pgClient', dbPostgres);
  }
};
