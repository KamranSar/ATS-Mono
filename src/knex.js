/* eslint-disable no-unused-vars */
const debug = require('debug')(`${process.env.APP_NAME}:` + 'src:knex:dbname');
const { logger, base64ToString } = require('cdcrhelpers');
const knex = require('knex');
const serverData = require('./service-config').server;

process.env.DB_HEARTBEAT_SECS = process.env.DB_HEARTBEAT_SECS ? process.env.DB_HEARTBEAT_SECS : 15;

module.exports = function (app) {

  // Oracle connection
  if (serverData.oracleEnabled) {
    const { connection, pool, connTimeout } = app.get('oracledb');
    // Convert username and password from base64 to utf8/ascii - Also handles if already in utf8/ascii.
    if (connection.user && connection.user.length > 1 && connection.password && connection.password.length > 1) {
      connection.user = connection.user == 'Oradoc_db1' ? connection.user : base64ToString(connection.user);
      connection.password = connection.user == 'Oradoc_db1' ? connection.password : base64ToString(connection.password);
    } else {
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
    const connConfig = {
      client: 'oracledb',
      native: false,
      connection,
      pool,
      acquireConnectionTimeout: connTimeout,
    };
    // Create connection
    let dbOracle = knex(connConfig);
    app.set('oracleClient', dbOracle);

    // Connection test - perform a fast server query
    app.oracle = {
      max: 12,
      errcnt: 0,
      connected: false,
      connectionTimeoutMS: 5000,
      heartbeatTimeoutMS: process.env.DB_HEARTBEAT_SECS * 1000,
    };
    // Ongoing connection maintenance interval
    setInterval(() => {
      if (!app.oracle.connected) {
        if (app.oracle.errcnt > 0) {
          // Destroy the connection pool
          dbOracle.destroy();
          debug(`Destroyed Oracle connection to  ${connInfo}`);
          // Connection attempt
          dbOracle = knex(connConfig);
          debug(`Attempting Oracle connection to ${connInfo}`);
        }
        // Test if connected by sending a fast server query
        dbOracle
          .raw('select banner from v$version')
          .then(() => {
            if (process.env.NODE_ENV === 'production') logger.info(`Successfully connected to ${connInfo}`);
            else debug(`Successfully connected to ${connInfo}`);
            app.oracle.connected = true;
            app.oracle.errcnt = 0;
            app.set('oracleClient', dbOracle);
          })
          .catch((error) => {
            logger.error('Connection error #%d at %s - ', ++app.oracle.errcnt, connInfo, { error });
            app.oracle.connected = false;
            if (app.oracle.errcnt == app.oracle.max) process.exit(1);
          });
      }
    }, app.oracle.connectionTimeoutMS);

    // Ongoing DB server heartbeat interval
    setInterval(() => {
      // Once connected, keep the connection alive with a periodic server check
      if (app.oracle.connected) {
        dbOracle
          .raw('select banner from v$version')
          .then(() => {
            if (process.env.NODE_ENV === 'production') logger.info(`Keepalive successfully sent to ${connInfo}`);
            else debug(`Keepalive successfully sent to ${connInfo}`);
          })
          .catch((error) => {
            logger.error('Keepalive error %s - ', connInfo, { error });
            app.oracle.connected = false;
          });
      }
    }, app.oracle.heartbeatTimeoutMS);
  }

  // Postgres connection
  if (serverData.postgresEnabled) {
    const { connection, pool, connTimeout } = app.get('postgres');
    // Convert username and password from base64 to utf8/ascii - Also handles if already in utf8/ascii.
    if (connection.user && connection.user.length > 1 && connection.password && connection.password.length > 1) {
      connection.user = connection.user == 'postgres' ? connection.user : base64ToString(connection.user);
      connection.password = connection.user == 'postgres' ? connection.password: base64ToString(connection.password);
    } else {
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
    const connConfig = {
      client: 'pg',
      connection: connString,
      pool,
      acquireConnectionTimeout: connTimeout,
    };
    // Create connection
    let dbPostgres = knex(connConfig);
    app.set('pgClient', dbPostgres);

    // Connection test - perform a fast server query
    app.postgres = {
      max: 12,
      errcnt: 0,
      connected: false,
      connectionTimeoutMS: 5000,
      heartbeatTimeoutMS: process.env.DB_HEARTBEAT_SECS * 1000,
    };
    // Ongoing connection maintenance interval
    setInterval(() => {
      if (!app.postgres.connected) {
        if (app.postgres.errcnt > 0) {
          // Destroy the connection pool
          dbPostgres.destroy();
          debug(`Destroyed Postgres connection to  ${connInfo}`);
          // Connection attempt
          dbPostgres = knex(connConfig);
          debug(`Attempting Postgres connection to ${connInfo}`);
        }
        dbPostgres
          .raw('SET timezone = "UTC";')
          .then(() => {
            if (process.env.NODE_ENV === 'production') logger.info(`Successfully connected to ${connInfo}`);
            else debug(`Successfully connected to ${connInfo}`);
            app.postgres.connected = true;
            app.postgres.errcnt = 0;
            app.set('pgClient', dbPostgres);
          })
          .catch((error) => {
            logger.error('Connection error #%d at %s - ', ++app.postgres.errcnt, connInfo, { error });
            app.postgres.connected = false;
            if (app.postgres.errcnt == app.postgres.max) process.exit(1);
          });
      }
    }, app.postgres.connectionTimeoutMS);

    // Ongoing DB server heartbeat interval
    setInterval(() => {
      // Once connected, keep the connection alive with a periodic server check
      if (app.postgres.connected) {
        dbPostgres
          .raw('SET timezone = "UTC";')
          .then(() => {
            if (process.env.NODE_ENV === 'production') logger.info(`Keepalive successfully sent to ${connInfo}`);
            else debug(`Keepalive successfully sent to ${connInfo}`);
          })
          .catch((error) => {
            logger.error('Keepalive error %s - ', connInfo, { error });
            app.postgres.connected = false;
          });
      }
    }, app.postgres.heartbeatTimeoutMS);
  }
};
