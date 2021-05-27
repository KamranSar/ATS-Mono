/**
 * Feathers client instance to allow for easy service calls.
 * Points to localhost:3000 during development.
 *
 * import feathers from "@/config/private/feathers.js"
 * await feather.service(...).get(...)
 */
import feathers from '@feathersjs/feathers';
import auth from '@feathersjs/authentication-client';
import getNewToken from '@/feathers/hooks/getNewToken.js';
// import socketio from '@feathersjs/socketio-client';
// import io from 'socket.io-client';
const rest = require('@feathersjs/rest-client');

let API_URL = window.location.origin;

if (window.location.hostname === 'localhost') {
  API_URL = 'http://localhost:3000';
}

// const socket = io(API_URL, { transports: ['websocket'] }); // https://socket.io/docs/v3/client-initialization/

// Connect to the same as the browser URL (only in the browser)
// https://docs.feathersjs.com/api/client/rest.html#rest-baseurl
const restClient = rest(API_URL);

const feathersClient = feathers()
  // .configure(socketio(socket))
  .configure(restClient.fetch(window.fetch))

  .configure(
    auth({
      // https://docs.feathersjs.com/api/authentication/client.html#configuration
      storage: window.localStorage,
      storageKey: process.env.VUE_APP_NAME,
      path: '/api/auth/v1/authentication',
    })
  )
  .hooks({
    before: {
      // all: [getNewToken],
      // all: [
      //   async (context) => {
      //     debugger;
      //     return context;
      //   },
      // ],
    },
  });

export default feathersClient;
