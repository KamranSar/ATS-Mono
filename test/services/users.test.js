const assert = require('assert');
const app = require('../../src/app');

describe('\'users\' service', () => {
  it('registered the service', () => {
    const userServiceName = app.get('authentication').service;        
    const service = app.service(userServiceName);

    assert.ok(service, 'Registered the service');
  });
});
