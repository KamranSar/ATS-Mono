const assert = require('assert');
const app = require('../../src/app');

describe('\'rawsqlservice_v2\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/database/v2/rawsqlservice');

    assert.ok(service, 'Registered the service');
  });
});
