const serviceName = 'authentication'; // Service name

/**
 * This is the name of the ID field used by the API's {id}
 */
const ids = ['id'];

/**
 * This is the docs portion of this API
 */
const schemaName = `${serviceName}`;
const schemaNameList = `${schemaName}_list`;
const docs = {
  description: 'Implemented in the Authentication Server',
  definitions: {
    [schemaName]: { },
    [schemaNameList]: { },
  },
  securities: ['find', 'get', 'create', 'update', 'patch', 'remove'],
  operations: {
    all: {
      summary: 'Not Implemented',
      deprecated: true,
      security: [
        {
          Bearer: [],
        },
      ],
    },
  },
};

module.exports = {
  ids,
  docs,
};
