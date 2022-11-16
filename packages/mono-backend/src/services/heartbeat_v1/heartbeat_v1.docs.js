const serviceName = require('path').basename(__filename, '.docs.js');
const serviceNameParts = serviceName.split('_');

/**
 * This is the name of the ID field used by the API's {id}
 */
const ids = ['id'];

/**
* This is the docs portion of this API
*/
const schemaName = `${serviceNameParts[0]}_${serviceNameParts[1]}`;
const schemaNameList = `${serviceNameParts[0]}_list`;
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
        400: {
          description: 'bad request',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                  code: {
                    type: 'integer',
                    default: 400,
                  },
                  className: {
                    type: 'string',
                  },
                  errors: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                }
              }
            }
          }
        },
        401: {
          description: 'not authenticated',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                  code: {
                    type: 'integer',
                    default: 401,
                  },
                  className: {
                    type: 'string',
                  },
                  errors: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                }
              }
            }
          }
        },
        500: {
          description: 'general error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                  code: {
                    type: 'integer',
                    default: 500,
                  },
                  className: {
                    type: 'string',
                  },
                  errors: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                }
              }
            }
          }
        },
      },
    },
  },
};

module.exports = {
  ids,
  docs,
};
