const serviceName = require('path').basename(__filename, '.docs.js');
const service = require('../../service-config').services.find(obj => { return (obj.name + '_' + obj.version) == serviceName; });

/**
 * This is the name of the ID field used by the API's {id}
 */
const ids = ['id'];

/**
 * This is the docs portion of this API
 */
const schemaName = `${service.name}_${service.version}`;
const schemaNameList = `${service.name}_list`;
const docs = {
  description: `${service.description}`,
  definitions: {
    [schemaName]: {
      type: 'object',
      required: ['_id'],
      properties: {
        _id: {
          type: 'integer',
        },
        lastname: {
          type: 'string',
          format: 'lastname',
        },
        firstname: {
          type: 'string',
          format: 'firstname',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
    [schemaNameList]: {
      type: 'array',
      items: { $ref: `#/components/schemas/${schemaName}` },
    },
  },
  securities: ['find', 'get', 'create', 'update', 'patch', 'remove'],
  operations: {
    find: {
      summary: 'Finds one or more A_PEOPLE rows',
      responses: {
        200: {
          description: 'success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  // pagination => total
                  total: {
                    type: 'integer',
                    format: 'int32',
                    default: 1,
                  },
                  // pagination => limit
                  limit: {
                    type: 'integer',
                    format: 'int32',
                    default: 10,
                  },
                  // pagination => skip
                  skip: {
                    type: 'integer',
                    format: 'int32',
                    default: 0,
                  },
                  // pagination => data
                  data: {
                    type: 'array',
                    items: { $ref: `#/components/schemas/${schemaName}` },
                  },
                },
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
        403: {
          description: 'forbidden or incorrect permissions',
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
                    default: 403,
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
    get: {
      summary: 'Gets an A_PEOPLE row',
    },
    create: {
      summary: 'Creates an A_PEOPLE row',
    },
    update: {
      summary: 'Updates an A_PEOPLE row',
    },
    patch: {
      summary: 'Patches an A_PEOPLE row',
    },
    remove: {
      summary: 'Removes an A_PEOPLE row',
    },
    all: {
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
