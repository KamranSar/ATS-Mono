const swagger = require('feathers-swagger');
/**
 * The main OpenAPI document definition
 * Need to change the {database} in the prefix and docspath to match the server type.
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md#schema
 * @see https://github.com/feathersjs-ecosystem/feathers-swagger#api
 */
module.exports = function (app) {
  const docspath = process.env.DOCS_PATH;
  const docsJsonPath = `${docspath}/spec.json`;

  const specs = {
    prefix: /^(\/?[^/]+){0,3}\/v\d{0,3}\//gm,
    versionPrefix: /v\d/,
    ignore: {
      paths: ['internal'],
    },
    docsPath: docspath,
    docsJsonPath: docsJsonPath,
    openApiVersion: 3,
    idType: 'string',
    uiIndex: true,
    docExpansion: 'none',
    specs: {
      info: {
        // Change app title & description to match your app.
        title: `CDCR EIS-MiddleTier Server (${process.env.APP_NAME} ${process.env.APP_RELEASE})`,
        description: `${process.env.APP_DESCRIPTION}`,
        termsOfService: 'https://www.cdcr.ca.gov/conditions-of-use/',
        contact: {
          name: 'Support',
          url: 'https://www.cdcr.ca.gov/contactus/',
          // email: 'support@example.com',
        },
        license: {
          name: 'Apache 2.0',
          url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
        },
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${app.get('port')}`,
          description: 'Development API server',
        },
        {
          url: `https://${app.get('dochost')}`,
          description: 'Test API server',
        },
        {
          url: `${app.get('authentication').jwtOptions.audience}`,
          description: 'Production API server',
        },
      ],
      externalDocs: {
        description: 'JSON file',
        url: docsJsonPath,
      },
      components: {
        securitySchemes: {
          Bearer: {
            type: 'http',
            description: 'Enter the FeathersJS JWT Bearer token',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  };
  app.configure(swagger(specs));
};
