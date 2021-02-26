import { default as msalPlugin } from 'vue-msal-browser';

const msalConfig = {
  auth: {
    tenant: '<your-tenant>',
    clientId: '<your-client-id>',
    authority: '<your-tenant-address>',
    redirectUri: '<your-redirect-url>', // It has to be configured on your Azure tenant
    scopes: ['<your-scopes>'],
  },
  cache: {
    cacheLocation: '<your-cache-location>',
  },
  graph: {
    url: '<your-graph-api-url>',
    scopes: '<your-graph-api-scopes>',
    response_type: 'blob',
  },
  mode: 'redirect',
};

export { msalPlugin, msalConfig };
