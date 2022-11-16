const debug = require('debug')(`${process.env.APP_NAME}:`+'src:redis:dbname');
const { logger } = require('cdcrhelpers');
const redisCache = require('feathers-redis-cache');
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
  app.configure(redisCache.client({ errorLogger: logger.error }));

  // REDIS only cares if the DISABLE_REDIS_CACHE param is present or not, value is irrelevant. If present, cache is disabled
  debug('DISABLE_REDIS_CACHE param (%s)', (process.env.DISABLE_REDIS_CACHE) ? process.env.DISABLE_REDIS_CACHE : 'undefined');

  if (!process.env.DISABLE_REDIS_CACHE || process.env.DISABLE_REDIS_CACHE !== 'true') {
    debug('Connecting to REDIS Service Cache server at %s ', redis_cfg.url);
    // If the REDIS connection fails, REDIS forces a process exit
    const redisSvcClient = app.get('redisClient');
    if (redisSvcClient) {
      let redisConn = { maxErrors: 5, errorCnt: 0 };
      redisSvcClient
        .on('ready', function () {
          if (process.env.NODE_ENV === 'production') logger.info('Successfully connected to REDIS Service Cache server at %s ', redis_cfg.url);
          else debug('Successfully connected to REDIS Service Cache server at %s ', redis_cfg.url);
          const redisSvcClient = app.get('redisClient');
          redisSvcClient.options.prefix = redis_cfg.prefix; // Change the default key prefix so it sorts better in Redis client tools.
          app.redisConnected = true;
          app.set('redisClient', redisSvcClient);
        })
        .on('error', (error) => {
          logger.error('REDIS Service Cache connection error #%d at %s -', ++redisConn.errorCnt, redis_cfg.url, { error: error.message || error });
          if (redisConn.errorCnt == redisConn.maxErrors) process.exit(1);
        });
    }

    // Configure the REDIS cache
    // The cache can be bypassed by setting query param $skipCacheHook to true on a cached service call
    const { cachePathPrefix } = redis_cfg;
    app.configure(redisCache.services({ pathPrefix: cachePathPrefix }));

    // Need to remove the unauthenticated api routes created by the redis cache.
    // They will be reimplemented as protected feathers api services.
    // https://github.com/sarkistlt/feathers-redis-cache/blob/master/src/services.ts
    removeRestService(app, `${cachePathPrefix}/clear/single`);
    removeRestService(app, `${cachePathPrefix}/clear/group`);
    removeRestService(app, `${cachePathPrefix}/clear/all`);
    removeRestService(app, `${cachePathPrefix}/flashdb`);
  }

  // Create and set a REDIS General Use client for anyone who needs a REDIS connection
  debug('Connecting to REDIS General Use server at %s ', redis_cfg.url);
  const redisGeneralUseClient = redis.createClient({ url: redis_cfg.url });
  if (redisGeneralUseClient) {
    let redisConn = { maxErrors: 6, errorCnt: 0, errorInterval: null, intervalMS: 5000 };
    redisGeneralUseClient
      .on('ready', function () {
        // If the REDIS connection was retried previously, then delete the interval.
        if (redisConn.errorInterval) clearInterval(redisConn.errorInterval);
        if (process.env.NODE_ENV === 'production') logger.info('Successfully connected to REDIS General Use server at %s ', redis_cfg.url);
        else debug('Successfully connected to REDIS General Use server at %s ', redis_cfg.url);
        // Promise wrapper for Raw Redis redisGeneralUseClient
        const redisClient = {
          client: redisGeneralUseClient,
          get: promisify(redisGeneralUseClient.get.bind(redisGeneralUseClient)),
          set: promisify(redisGeneralUseClient.set.bind(redisGeneralUseClient)),
          del: promisify(redisGeneralUseClient.del.bind(redisGeneralUseClient)),
          exists: promisify(redisGeneralUseClient.exists.bind(redisGeneralUseClient)),
          expireat: promisify(redisGeneralUseClient.exists.bind(redisGeneralUseClient)),
        };
        app.set('redisRawClient', redisClient);
      })
      .on('error', (error) => {
        if (!redisConn.errorInterval) {
          redisConn.errorInterval = setInterval(() => {
            logger.error('REDIS General Use connection error #%d at %s -', ++redisConn.errorCnt, redis_cfg.url, { error: error.message || error });
            // If we've tried to connect to REDIS for (redisConn.maxErrors * redisConn.intervalMS), then stop the server.
            if (redisConn.errorCnt == redisConn.maxErrors) process.exit(1);
          }, redisConn.intervalMS);
        }
      });
  }
};
