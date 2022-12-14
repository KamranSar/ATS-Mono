const { authenticate } = require('@feathersjs/authentication').hooks;
const redisCache = require('feathers-redis-cache').hooks;
const { discard, setNow, iff, alterItems, isProvider } = require('feathers-hooks-common');
const checkPermissions = require('feathers-permissions');
const { logSvcMsg, setUserID, fixQueryType } = require('cdcrhooks');
const server = require('../../service-config').server;
const authActive = process.env.NODE_ENV != 'development' || server.authActive ? true : false;

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}
function formatDate(date) {
  return [padTo2Digits(date.getUTCMonth() + 1), padTo2Digits(date.getUTCDate()), date.getUTCFullYear()].join('/');
}

module.exports = {
  before: {
    all: [
      iff(authActive, authenticate('jwt')),
      logSvcMsg(),
      iff(
        authActive,
        checkPermissions({
          roles: (context) => [context.path],
          entity: 'apiperms',
        })
      ),
    ],
    find: [
      // Convert data types from strings back to proper data type
      // web sockets and internal calls send the data in the correct form.
      // Only REST calls are in string format due to being on the URL (as strings)
      iff(
        isProvider('rest'),
        fixQueryType('some_boolean_field', 'Boolean'),
        fixQueryType('some_number_field', 'Number'),
        fixQueryType('some_nullable_field', 'Null')
      ),
      redisCache.before(),
    ],
    get: [redisCache.before()],
    create: [setUserID('updatedBy', 'createdBy'), setNow('createdAt'), setNow('updatedAt')],
    update: [setUserID('updatedBy'), setNow('updatedAt'), discard('createdAt', 'createdBy')],
    patch: [setUserID('updatedBy'), setNow('updatedAt'), discard('createdAt', 'createdBy')],
    remove: [],
  },

  after: {
    all: [
      logSvcMsg(),
      alterItems((rec) => {
        if (rec && rec.releaseDate) {
          // rec.releaseDate = new Date(rec.releaseDate).toLocaleDateString('en-US', {
          //   year: 'numeric',
          //   month: '2-digit',
          //   day: '2-digit',
          // });
          console.warn('***** DEBUG - transfer.hook. rec.releaseDate => ', rec.releaseDate);
          rec.releaseDate = formatDate(new Date(rec.releaseDate));
        }
        if (rec && rec.transferDate) {
          // rec.transferDate = new Date(rec.transferDate).toLocaleDateString('en-US', {
          //   year: 'numeric',
          //   month: '2-digit',
          //   day: '2-digit',
          // });
          // console.warn('***** DEBUG - transfer.hook. rec.transferdate => ', rec.transferDate);
          rec.transferDate = formatDate(new Date(rec.transferDate));
        }
        if (rec && rec.originalEndorsementDate) {
          // rec.originalEndorsementDate = new Date(rec.originalEndorsementDate).toLocaleDateString('en-US', {
          //   year: 'numeric',
          //   month: '2-digit',
          //   day: '2-digit',
          // });
          // console.warn('***** DEBUG - transfer.hook. rec.originalEndorsementDate => ', rec.originalEndorsementDate);
          rec.originalEndorsementDate = formatDate(new Date(rec.originalEndorsementDate));
        }
        if (rec && rec.currentEndorsementDate) {
          // rec.currentEndorsementDate = new Date(rec.currentEndorsementDate).toLocaleDateString('en-US', {
          //   year: 'numeric',
          //   month: '2-digit',
          //   day: '2-digit',
          // });
          // console.warn('***** DEBUG - transfer.hook. rec.currentEndorsementDate => ', rec.currentEndorsementDate);
          rec.currentEndorsementDate = formatDate(new Date(rec.currentEndorsementDate));
        }
        if (rec && rec.expirationEndorsementDate) {
          // rec.currentEndorsementDate = new Date(rec.currentEndorsementDate).toLocaleDateString('en-US', {
          //   year: 'numeric',
          //   month: '2-digit',
          //   day: '2-digit',
          // });
          // console.warn('***** DEBUG - transfer.hook. rec.currentEndorsementDate => ', rec.currentEndorsementDate);
          rec.expirationEndorsementDate = formatDate(new Date(rec.expirationEndorsementDate));
        }
      }),
    ],
    find: [
      redisCache.after({ expiration: 600 }), // 10 minutes
    ],
    get: [
      redisCache.after({ expiration: 600 }), // 10 minutes
    ],
    create: [redisCache.purge()],
    update: [redisCache.purge()],
    patch: [redisCache.purge()],
    remove: [redisCache.purge()],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
