const assert = require('assert');
const app = require('../../src/app');

describe('\'oracleservice\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/database/v1/oracleservice');

    assert.ok(service, 'Registered the service');
  });
});
