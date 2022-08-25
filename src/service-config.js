const appCfg = require('../package.json');

module.exports = {
  server: {
    //* DO NOT modify these first 2 elements in this file.
    name: appCfg.name,
    description: appCfg.description,
    //* You can modify all of the following elements:
    appPath: '/api/ats',
    docsPath: '/docs/ats',
    release: 'R1',
    //* authActive values: true = authentication activated, false = authentication deactivated meaning no auth required for all services.
    authActive: true,
    //* Database enable/disable flags:
    //* All DB flags are optional and can be removed along with their associated code if not used.
    mongooseEnabled: true,
    mongodbEnabled: false,
  },
  services: [
    //* List off Supported Services:
    //* mongooseservice is required, all other services are optional and can be removed along with their associated code if not used.
    {
      name: 'transfer',
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
      name: 'reason',
      version: 'v1',
      enabled: true,
      description: 'CRUD service for transfer reasons.',
    },
    {
      name: 'departuresarrivals',
      version: 'v1',
      enabled: true,
      description: 'Gets departing offenders from institution on that day',
    },
    {
      name: 'destination',
      version: 'v1',
      enabled: true,
      description: 'CRUD service for custom destinations.',
    },
  ],
};
//*** DO NOT MODIFY THIS CODE ***//
if (process.env.NODE_ENV === 'production') module.exports.server.authActive = true;
else if (process.env.AUTHACTIVE) {
  // set based on env variable if defined
  module.exports.server.authActive = process.env.AUTHACTIVE.toLowerCase() === 'true';
} // otherwise, use the setting from above
