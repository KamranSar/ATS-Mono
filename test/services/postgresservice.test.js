const assert = require('assert');
const app = require('../../src/app');

describe('\'postgresservice\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/database/v1/postgresservice');

    assert.ok(service, 'Registered the service');
  });
});
