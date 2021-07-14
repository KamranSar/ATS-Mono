const appCfg = require('../package.json');

module.exports =
{
  'server': {
    //* FIXME: You MUST set the 'name' and 'description' elements in the "package.json" file before modifying this file.
    //* DO NOT modify these first 2 elements in this file.
    'name': appCfg.name,
    'description': appCfg.description,
    //* You can modify all of the following elements:
    'appPath': '/api/database',
    'docsPath': '/docs/database',
    'release': 'R1',
    //* authActive values: true = authentication activated, false = authentication deactivated meaning no auth required for all services.
    'authActive': true,
    //* Database enable/disable flags:
    //* All DB flags are optional and can be removed along with their associated code if not used.
    'mongooseEnabled': true,
    'mongodbEnabled': true,
    'mssqlEnabled': true,
    'oracleEnabled': true,
    'postgresEnabled': true
  },
  'services': [
    //* List off Supported Services:
    //* mongooseservice is required, all other services are optional and can be removed along with their associated code if not used.
    {
      'name': 'mongooseservice',
      'version': 'v1',
      'enabled': true,
      'description': 'example of a CRUD services for a MongoDB Mongoose schema database.'
    },
    {
      'name': 'mongodbservice',
      'version': 'v1',
      'enabled': true,
      'description': 'Example of a CRUD services for a MongoDB database.'
    },
    {
      'name': 'mssqlservice',
      'version': 'v1',
      'enabled': true,
      'description': 'CRUD services for an MS-SQL database. The A_PEOPLE table is used for this template.'
    },
    {
      'name': 'oracleservice',
      'version': 'v1',
      'enabled': true,
      'description': 'CRUD services for an Oracle database. The A_PEOPLE table is used for this template.'
    },
    {
      'name': 'postgresservice',
      'version': 'v1',
      'enabled': true,
      'description': 'CRUD services for an Postgres database. The A_PEOPLE table is used for this template.'
    },
    {
      'name': 'rawsqlservice',
      'version': 'v1',
      'enabled': true,
      'description': 'CRUD services for a Custom database server. Complex queries and payloads used for this template.'
    },
    {
      'name': 'rawsqlservice',
      'version': 'v2',
      'enabled': true,
      'description': 'CRUD services for a Custom database server. Complex queries and payloads used for this template.'
    },
    {
      'name': 'customservice',
      'version': 'v1',
      'enabled': true,
      'description': 'Example of a basic Custom service.'
    }
  ]
};
//*** DO NOT MODIFY THIS CODE ***//
if (process.env.NODE_ENV === 'production') module.exports.server.authActive = true;
else if (process.env.AUTHACTIVE) {
  // set based on env variable if defined
  module.exports.server.authActive = process.env.AUTHACTIVE.toLowerCase() === 'true';
} // otherwise, use the setting from above
