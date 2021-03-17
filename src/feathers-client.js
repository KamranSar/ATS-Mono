// https://vuex.feathersjs.com/getting-started.html#feathers-client-feathers-vuex

import feathers from '@feathersjs/feathers';
// import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
// import io from 'socket.io-client';
const rest = require('@feathersjs/rest-client');
import { iff, discard } from 'feathers-hooks-common';
import feathersVuex from 'feathers-vuex';

// let API_URL = window.location.origin;

// if (window.location.hostname === 'localhost') {
//   API_URL = 'http://localhost:3000';
// }

// // const socket = io('http://localhost:3030', { transports: ['websocket'] });
// const socket = io(API_URL, { transports: ['websocket'] }); // https://socket.io/docs/v3/client-initialization/
// // const socket = io({ transports: ['websocket'] }); // https://socket.io/docs/v3/client-initialization/

// Connect to the same as the browser URL (only in the browser)
// https://docs.feathersjs.com/api/client/rest.html#rest-baseurl
const restClient = rest();
// Connect to a different URL
//const restClient = rest('http://feathers-api.com');

const feathersClient = feathers()
  // .configure(socketio(socket))
  // Configure an AJAX library (see below) with that client
  .configure(restClient.fetch(window.fetch))
  .configure(auth({ storage: window.localStorage }))
  .hooks({
    before: {
      all: [
        iff(
          (context) => ['create', 'update', 'patch'].includes(context.method),
          discard('__id', '__isTemp')
        ),
      ],
    },
  });

export default feathersClient;

// Setting up feathers-vuex
const {
  makeServicePlugin,
  makeAuthPlugin,
  BaseModel,
  models,
  FeathersVuex,
} = feathersVuex(feathersClient, {
  enableEvents: false, // Must have socket.io wired up to enable this
  whitelist: ['$regex', '$options'],
});

export { makeAuthPlugin, makeServicePlugin, BaseModel, models, FeathersVuex };
