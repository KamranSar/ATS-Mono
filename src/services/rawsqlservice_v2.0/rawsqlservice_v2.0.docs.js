const serviceName = 'rawsqlservice'; // Service name
const version = '2.0'; // Service version

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
  description: 'CRUD services for a Custom database server. Complex queries and payloads used for this template.',
  definitions: {
    [schemaName]: { },
    [schemaNameList]: { },
  },
  securities: ['find', 'get', 'create', 'update', 'patch', 'remove'],
  operations: {
    find: {
      summary: 'Finds one or more A_PEOPLE rows',
      parameters: [
        {
          required: true,
          in: 'query',
          name: 'lastname',
          description: 'The last name in any combination of case (e.g. Smythe)',
          schema: {
            type: 'string',
          },
        },
        {
          required: true,
          in: 'query',
          name: 'firstname',
          description: 'The first name in any combination of case (e.g. Joan)',
          schema: {
            type: 'string',
          },
        },
      ],
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
                    items: {
                      properties: {
                        ID: {
                          type: 'integer',
                        },
                        LASTNAME: {
                          type: 'string',
                        },
                        FIRSTNAME: {
                          type: 'string',
                        },
                        CREATEDAT: {
                          type: 'string',
                          format: 'date-time',
                        },
                        UPDATEDAT: {
                          type: 'string',
                          format: 'date-time',
                        },
                        birds: {
                          type: 'array',
                          items: {
                            properties: {
                              PEOPLE_ID: {
                                type: 'integer',
                              },
                              ID: {
                                type: 'integer',
                              },
                              NAME: {
                                type: 'string',
                              },
                              TITLE: {
                                type: 'string',
                              },
                              AGE: {
                                type: 'integer',
                              },
                              SKILL: {
                                type: 'string',
                              },
                            },
                          },
                        },
                        cats: {
                          type: 'array',
                          items: {
                            properties: {
                              PEOPLE_ID: {
                                type: 'integer',
                              },
                              ID: {
                                type: 'integer',
                              },
                              NAME: {
                                type: 'string',
                              },
                              TITLE: {
                                type: 'string',
                              },
                              AGE: {
                                type: 'integer',
                              },
                              SKILL: {
                                type: 'string',
                              },
                            },
                          },
                        },
                        dogs: {
                          type: 'array',
                          items: {
                            properties: {
                              PEOPLE_ID: {
                                type: 'integer',
                              },
                              ID: {
                                type: 'integer',
                              },
                              NAME: {
                                type: 'string',
                              },
                              TITLE: {
                                type: 'string',
                              },
                              AGE: {
                                type: 'integer',
                              },
                              SKILL: {
                                type: 'string',
                              },
                            },
                          },
                        },
                      },
                    },
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
      summary: 'Payload for the given ID',
    },
    create: {
      summary: 'Not Implemented',
      deprecated: true,
    },
    update: {
      summary: 'Not Implemented',
      deprecated: true,
    },
    patch: {
      summary: 'Not Implemented',
      deprecated: true,
    },
    remove: {
      summary: 'Not Implemented',
      deprecated: true,
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
