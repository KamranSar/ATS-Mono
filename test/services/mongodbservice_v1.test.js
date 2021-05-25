const assert = require('assert');
const app = require('../../src/app');

describe('\'mongodbservice_v1\' service', () => {
  it('registered the service', () => {
    const service = app.service('mongodbservice-v-1');

    assert.ok(service, 'Registered the service');
  });
});
