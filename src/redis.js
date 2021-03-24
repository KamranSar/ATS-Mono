const debug = require('debug')('database-template:src:redis:dbname');
const { logger } = require('cdcrhelpers');
const redisCache = require('feathers-redis-cache');
// const sync = require('feathers-sync');
const redis = require('redis');
const { promisify } = require('util');

/**
 * Removes a REST end point from the Express list API end points.  This only works
 * for REST end point set up by Express Framework.
 * @see https://github.com/feathersjs/feathers/issues/446#issuecomment-286950093
 * @param {Object} app A FeathersJS App object
 * @param {String} path The API end point to remove.  Must be a REST end point.
 */
function removeRestService(app, path) {
  app._router.stack.forEach((layer) => {
    if (!layer) return;
    if (layer && !layer.match(path)) return;
    if (['query', 'expressInit'].indexOf(layer.name) != -1) return;
    if (layer.path == path) {
      let idx = app._router.stack.indexOf(layer);
      app._router.stack.splice(idx, 1);
    }
  });
}

module.exports = function (app) {
  // Get REDIS settings and configure
  const redis_cfg = app.get('redis');
  const redis_svr = process.env.REDIS_SVR ? process.env.REDIS_SVR : 'localhost';
  const redis_port = process.env.REDIS_PORT ? process.env.REDIS_PORT : '6379';
  redis_cfg.url = `redis://${redis_svr}:${redis_port}`;
  app.set('redis', redis_cfg);
  debug('Connecting to REDIS server at %s ', redis_cfg.url);
  app.configure(redisCache.client({ errorLogger: logger.error }));

  // If the REDIS connection fails, REDIS forces a process exit
  const redis_client = app.get('redisClient');
  if (redis_client) {
    let redis = { max: 5, errcnt: 0, connected: false };
    redis_client
      .on('ready', function () {
        redis.connected = true;
        debug('Successfully connected to REDIS server at %s ', redis_cfg.url);
        const redis_client = app.get('redisClient');
        redis_client.options.prefix = redis_cfg.prefix; // Change the default key prefix so it sorts better in Redis client tools.
        app.set('redisClient', redis_client);
      })
      .on('error', (error) => {
        logger.error('REDIS error #%d at %s - ', ++redis.errcnt, redis_cfg.url, { error });
        if (redis.errcnt == redis.max) process.exit(1);
      });
  }

  // Configure the REDIS cache
  // The cache can be bypassed by setting query param $skipCacheHook to true on a cached service call
  const { cachePathPrefix } = redis_cfg;
  app.configure(redisCache.services({ pathPrefix: cachePathPrefix }));

  // Feathers websocket sync via REDIS
  // app.configure(
  //   sync({
  //     uri: redis_cfg.url,
  //   })
  // );

  // Need to remove the unauthenticated api routes created by the redis cache.
  // They will be reimplemented as protected feathers api services.
  const { DISABLE_REDIS_CACHE } = process.env;
  if (!DISABLE_REDIS_CACHE) {
    // https://github.com/sarkistlt/feathers-redis-cache/blob/master/src/services.ts
    removeRestService(app, `${cachePathPrefix}/clear/single`);
    removeRestService(app, `${cachePathPrefix}/clear/group`);
    removeRestService(app, `${cachePathPrefix}/clear/all`);
    removeRestService(app, `${cachePathPrefix}/flashdb`);
  }

  app.set('redisCacheClient', redisCache);

  // Create and set a REDIS client for anyone who needs a redis connection
  const client = redis.createClient({ url: redis_cfg.url });
  client.on('error', function (error) {
    logger.error('REDIS error #%d at %s - ', redis_cfg.url, { error });
  });
  // Promise wrapper for Redis client
  const redisClient = {
    client: client,
    get: promisify(client.get.bind(client)),
    set: promisify(client.set.bind(client)),
    del: promisify(client.del.bind(client)),
    exists: promisify(client.exists.bind(client)),
    expireat: promisify(client.exists.bind(client)),
  };

  app.set('redisRawClient', redisClient);
};
