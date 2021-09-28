/* eslint-disable no-unused-vars */
const debug = require('debug')(`${process.env.APP_NAME}:` + 'src:sequelize:dbname');
const { logger, base64ToString } = require('cdcrhelpers');
const Sequelize = require('sequelize');
const serverData = require('./service-config').server;

process.env.DB_HEARTBEAT_SECS = process.env.DB_HEARTBEAT_SECS ? process.env.DB_HEARTBEAT_SECS : 15;

module.exports = function (app) {
  // MS-SQL connection
  if (serverData.mssqlEnabled) {
    const connConfig = app.get('mssql');
  
    // Convert username and password from base64 to utf8/ascii - Also handles if already in utf8/ascii.
    if (connConfig.userName && connConfig.userName.length > 1 && connConfig.password && connConfig.password.length > 1) {
      connConfig.userName = connConfig.userName == 'SA' ? connConfig.userName : base64ToString(connConfig.userName);
      connConfig.dialectOptions.authentication.options.userName = connConfig.userName;
      connConfig.password = connConfig.userName == 'SA' ? connConfig.password: base64ToString(connConfig.password);
      connConfig.dialectOptions.authentication.options.password = connConfig.password;
    } else {
      logger.error('sequelize: MS-SQL username or password is missing or incomplete');
      process.exit(1);
    }
    // If the server or database strings are missing or incomplete, we cannot open the DB server.
    if (!connConfig.host || connConfig.host.length < 1 ||
      !connConfig.database || connConfig.database.length < 1) {
      logger.error('sequelize: MS-SQL server or database strings are missing or incomplete');
      process.exit(1);
    }
    // Instance name and port are mutually exclusive, so do some checks
    // Use port if it is passed in and instance name is not
    if (process.env.MSSQL_PORT) {
      connConfig.port = parseInt(process.env.MSSQL_PORT, 10);
      connConfig.dialectOptions.options.port = connConfig.port;
      if (!process.env.MSSQL_DB_INSTANCE_NAME) delete connConfig.dialectOptions.options.instanceName;
    }
    // Use instance name if it is passed in and port is not
    if (process.env.MSSQL_DB_INSTANCE_NAME) {
      connConfig.port = process.env.MSSQL_PORT;
      connConfig.dialectOptions.options.port = process.env.MSSQL_PORT;
      if (!process.env.MSSQL_PORT) {
        delete connConfig.port;
        delete connConfig.dialectOptions.options.port;
      }
    }
    
    const connInfo = `MS-SQL server for (${connConfig.database}) database at: ${connConfig.host}`;
    debug(`Connecting to ${connInfo}...`);
    // Create connection
    let dbMssql = new Sequelize(connConfig);
    app.set('mssqlClient', dbMssql);

    // Connection test - perform a fast server query
    app.mssql = {
      max: 12,
      errcnt: 0,
      connected: false,
      connectionTimeoutMS: 5000,
      heartbeatTimeoutMS: process.env.DB_HEARTBEAT_SECS * 1000,
    };
    // Ongoing connection maintenance interval
    setInterval(() => {
      if (!app.mssql.connected) {
        if (app.mssql.errcnt > 0) {
          // Close all connections used by this sequelize instance, and free all references so the instance can be garbage collected.
          dbMssql.close();
          debug(`Destroyed MS-SQL connection to  ${connInfo}`);
          // Connection attempt
          dbMssql = new Sequelize(connConfig);
          debug(`Attempting MS-SQL connection to ${connInfo}`);
        }
        // Test if connected 
        dbMssql.authenticate()
          .then(() => {
            if (process.env.NODE_ENV === 'production') logger.info(`Successfully connected to ${connInfo}`);
            else debug(`Successfully connected to ${connInfo}`);
            app.mssql.connected = true;
            app.mssql.errcnt = 0;
          })
          .catch((error) => {
            logger.error(`Connection error #${++app.mssql.errcnt} at ${connInfo} - ${error}`);
            app.mssql.connected = false;
            if (app.mssql.errcnt == app.mssql.max) process.exit(1);
          });
      }
    }, app.mssql.connectionTimeoutMS);
    // Ongoing DB server heartbeat interval
    setInterval(() => {
    // Once connected, keep the connection alive with a periodic server check
      if (app.mssql.connected) {
        dbMssql.authenticate()
          .then(() => {
            if (process.env.NODE_ENV === 'production') logger.info(`Keepalive successfully sent to ${connInfo}`);
            else debug(`Keepalive successfully sent to ${connInfo}`);
          })
          .catch((error) => {
            logger.error(`Keepalive error at ${connInfo} - ${error}`);
            app.mssql.connected = false;
          });
      }
    }, app.mssql.heartbeatTimeoutMS);

    // Set up data relationships in model
    const oldSetup = app.setup;
    app.setup = function (...args) {
      const result = oldSetup.apply(this, args);
      const models = dbMssql.models;
      Object.keys(models).forEach(name => {
        if ('associate' in models[name]) {
          models[name].associate(models);
        }
      });
      // Sync to the database
      // app.set('sequelizeSync', sequelize.sync());
      return result;
    };

  }

};
  