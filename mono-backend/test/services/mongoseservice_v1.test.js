const assert = require('assert');
const app = require('../../src/app');

describe('\'mongoseservice_v1\' service', () => {
  it('registered the service', () => {
    const service = app.service('mongoseservice-v-1');

    assert.ok(service, 'Registered the service');
  });
});
