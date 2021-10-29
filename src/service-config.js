const appCfg = require('../package.json');

module.exports = {
  server: {
    //* FIXME: You MUST set the 'name' and 'description' elements in the "package.json" file before modifying this file.
    //* DO NOT modify these first 2 elements in this file.
    name: appCfg.name,
    description: appCfg.description,
    //* You can modify all of the following elements:
    appPath: '/api/ats',
    docsPath: '/docs/ats',
    release: 'R1',
    //* authActive values: true = authentication activated, false = authentication deactivated meaning no auth required for all services.
    authActive: false,
    //* Database enable/disable flags:
    //* All DB flags are optional and can be removed along with their associated code if not used.
    mongooseEnabled: true,
    mongodbEnabled: false,
    mssqlEnabled: false,
    oracleEnabled: false,
    postgresEnabled: false,
  },
  services: [
    //* List off Supported Services:
    //* mongooseservice is required, all other services are optional and can be removed along with their associated code if not used.
    {
      name: 'mongooseservice',
      version: 'v1',
      enabled: true,
      description: 'example of a CRUD services for a MongoDB Mongoose schema database.',
    },
    {
      name: 'offendertransfer',
      version: 'v1',
      enabled: true,
      description: 'CRUD service for a transfer of an offender.',
    },
    {
      name: 'schedule',
      version: 'v1',
      enabled: true,
      description: 'CRUD service for transfer schedules.',
    },
    {
      name: 'mongodbservice',
      version: 'v1',
      enabled: false,
      description: 'Example of a CRUD services for a MongoDB database.',
    },
    {
      // Only an example
      name: 'customservice',
      version: 'v1',
      enabled: false,
      description: 'Example of a basic Custom service.',
    },
  ],
};
//*** DO NOT MODIFY THIS CODE ***//
if (process.env.NODE_ENV === 'production') module.exports.server.authActive = true;
else if (process.env.AUTHACTIVE) {
  // set based on env variable if defined
  module.exports.server.authActive = process.env.AUTHACTIVE.toLowerCase() === 'true';
} // otherwise, use the setting from above
