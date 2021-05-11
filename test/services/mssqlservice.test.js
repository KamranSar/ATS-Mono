const assert = require('assert');
const app = require('../../src/app');

describe('\'mssqlservice\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/database/v1/mssqlservice');

    assert.ok(service, 'Registered the service');
  });
});
