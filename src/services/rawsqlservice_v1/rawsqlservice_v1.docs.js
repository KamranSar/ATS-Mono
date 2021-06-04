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
    [schemaName]: {},
    [schemaNameList]: {},
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
