const serviceName = 'heartbeat'; // Service name
const version = '1'; // Service version

/**
 * This is the name of the ID field used by the API's {id}
 */
const ids = ['id'];

/**
 * This is the docs portion of this API
 */
const schemaName = `${serviceName}_v${version}`;
const schemaNameList = `${schemaName}_list`;
const docs = {
  description: 'Service to check if server is running',
  definitions: {
    [schemaName]: {
      type: 'object',
      properties: {
        system_time: {
          type: 'string',
          format: 'date-time'
        },
        process_pid: {
          type: 'number',
          format: 'int32',
          default: '74510'
        },
        process_uptime: {
          type: 'number',
          format: 'double',
          default: '55.810666713'
        },
        os_uptime: {
          type: 'integer',
          format: 'int64',
          default: '49619'
        },
      },
    },
    [schemaNameList]: {
      type: 'array',
      items: { $ref: `#/components/schemas/${schemaName}` },
    },
  },
  operations: {
    find: {
      summary: 'Returns information about the running application',
      parameters: [],
      responses: {
        200: {
          description: 'success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                $ref: `#/components/schemas/${schemaName}`
              },
            },
          },
        },
        500: {
          description: 'general error',
        },
      },
    },
  },
};

module.exports = {
  ids,
  docs,
};
