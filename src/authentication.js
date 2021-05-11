const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
// Implemented via https://docs.feathersjs.com/api/authentication/oauth.html#setup-express
// to correct "connect.session() MemoryStore is not designed for a production environment..." warning.

module.exports = (app) => {
  const authentication = new AuthenticationService(app);
  authentication.register('jwt', new JWTStrategy());

  const { ids, docs } = require('./authentication.docs');
  authentication.id = ids;
  authentication.docs = docs;
  app.use('/internal/authentication', authentication);
};
