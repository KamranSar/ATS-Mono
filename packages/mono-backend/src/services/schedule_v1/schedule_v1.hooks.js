const { authenticate } = require('@feathersjs/authentication').hooks;
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
      //alterItems((rec) => (rec.transferDate = new Date(rec.transferDate).setHours(0, 0, 0, 0))),
      // alterItems((rec) => {
      //   console.log('alterItems: rec => ', JSON.stringify(rec));
      //   if (rec && rec.transferDate) {
      //     rec.transferDate = new Date(rec.transferDate);
      //   }
      // }),
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
    ],
    get: [],
    create: [setUserID('updatedBy', 'createdBy'), setNow('createdAt'), setNow('updatedAt')],
    update: [setUserID('updatedBy'), setNow('updatedAt'), discard('createdAt', 'createdBy')],
    patch: [setUserID('updatedBy'), setNow('updatedAt'), discard('createdAt', 'createdBy')],
    remove: [],
  },

  after: {
    all: [
      logSvcMsg(),
      //alterItems((rec) => (rec.transferDate = new Date(rec.transferDate).setHours(0, 0, 0, 0))),
      alterItems((rec) => {
        if (rec && rec.transferDate) {
          // rec.transferDate = new Date(rec.transferDate).toLocaleDateString('en-US', {
          //   year: 'numeric',
          //   month: '2-digit',
          //   day: '2-digit',
          // });
          // console.warn('***** DEBUG - schedule.hook. rec.transferDate => ', rec.transferDate);
          rec.transferDate = formatDate(new Date(rec.transferDate));
        }
      }),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
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
