const assert = require('assert');
const app = require('../../src/app');

describe('\'rawsqlservice\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/database/v1/rawsqlservice');

    assert.ok(service, 'Registered the service');
  });
});
