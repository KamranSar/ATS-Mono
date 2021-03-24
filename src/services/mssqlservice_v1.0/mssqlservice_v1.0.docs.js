const serviceName = 'mssqlservice'; // Service name
const version = '1.0'; // Service version

/**
 * This is the name of the ID field used by the API's {id}
 */
const ids = ['_id'];

/**
 * This is the docs portion of this API
 */
const schemaName = `${serviceName}_v${version}`;
const schemaNameList = `${schemaName}_list`;
const docs = {
  description: 'CRUD services for an MS-SQL database. The A_PEOPLE table is used for this template.',
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
        401: {
          description: 'not authenticated',
        },
        500: {
          description: 'general error',
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
