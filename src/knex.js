/* eslint-disable no-unused-vars */
const debug = require('debug')(`${process.env.APP_NAME}:` + 'src:knex:dbname');
const { logger, base64ToString } = require('cdcrhelpers');
const knex = require('knex');
const serverData = require('./service-config').server;

module.exports = function (app) {
  // MS-SQL connection
  if (serverData.mssqlEnabled) {
    const { connection, pool, connTimeout } = app.get('mssql');
    // Convert username and password from base64 to utf8/ascii - Also handles if already in utf8/ascii.
    if (connection.user && connection.user.length > 1 && connection.password && connection.password.length > 1) {
      const username = (connection.user == 'SA') ? connection.user: base64ToString(connection.user);
      if (username !== connection.user) connection.user = username;
      const password = base64ToString(connection.password);
      if (password !== connection.password) connection.password = password;
    }
    else {
      logger.error('knex: MS-SQL username or password is missing or incomplete');
      process.exit(1);
    }
    // If the server, port, or database strings are missing or incomplete, we cannot open the DB server.
    if (!connection.server || connection.server.length < 7 ||
      !connection.options.port || connection.options.port.length < 4 ||
      !connection.database || connection.database.length < 1) {
      logger.error('knex: MS-SQL server, port, or database strings are missing or incomplete');
      process.exit(1);
    }
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
    // Convert username and password from base64 to utf8/ascii - Also handles if already in utf8/ascii.
    if (connection.user && connection.user.length > 1 && connection.password && connection.password.length > 1) {
      const username = (connection.user == 'Oradoc_db1') ? connection.user: base64ToString(connection.user);
      if (username !== connection.user) connection.user = username;
      const password = base64ToString(connection.password);
      if (password !== connection.password) connection.password = password;
    }
    else {
      logger.error('knex: Oracle username or password is missing or incomplete');
      process.exit(1);
    }
    // If the connection string is missing or too short, we cannot open the DB server.
    if (!connection.connectString || connection.connectString.length < 15) {
      logger.error('knex: Oracle connection string is missing or incomplete');
      process.exit(1);
    }

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
    // Convert username and password from base64 to utf8/ascii - Also handles if already in utf8/ascii.
    if (connection.user && connection.user.length > 1 && connection.password && connection.password.length > 1) {
      const username = (connection.user == 'postgres') ? connection.user: base64ToString(connection.user);
      if (username !== connection.user) connection.user = username;
      const password = base64ToString(connection.password);
      if (password !== connection.password) connection.password = password;
    }
    else {
      logger.error('knex: Postgres SQL username or password is missing or incomplete');
      process.exit(1);
    }
    // If the server, port, or database strings are missing or incomplete, we cannot open the DB server.
    if (!connection.server || connection.server.length < 7 ||
      !connection.options.port || connection.options.port.length < 4 ||
      !connection.database || connection.database.length < 1) {
      logger.error('knex: Postgres SQL server, port, or database strings are missing or incomplete');
      process.exit(1);
    }
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
