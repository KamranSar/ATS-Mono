/**
 * Feathers client instance to allow for easy service calls.
 * Points to localhost:3000 during development.
 *
 * import feathers from "@/feathers/index.js"
 * await feather.service(...).get(...)
 */
import feathers from '@feathersjs/feathers';
import auth from '@feathersjs/authentication-client';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';
import myApp from '@/config/myApp';

let API_URL = window.location.origin;

// console.log({ API_URL });

// Create the Feathers client
const feathersClient = feathers();
const useWebSocket = myApp.useWebSocketConnection;
if (useWebSocket) {
  // https://docs.feathersjs.com/api/client/socketio.html#socketio-socket
  const socket = io(API_URL, {
    transports: ['websocket'],
  }); // https://socket.io/docs/v3/client-initialization/
  feathersClient.configure(
    socketio(socket, {
      timeout: 10000,
    })
  );
} else {
  const rest = require('@feathersjs/rest-client');
  // Connect to the same as the browser URL
  // https://docs.feathersjs.com/api/client/rest.html#rest-baseurl
  const restClient = rest(API_URL);
  feathersClient.configure(restClient.fetch(window.fetch));
}

feathersClient
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
      all: [
        async (context) => {
          return context;
        },
      ],
    },
  });

if (useWebSocket) {
  feathersClient.io.on('connect', () => {
    // Show online message
    console.log('socketio connect');
  });
  feathersClient.io.on('disconnect', (reason) => {
    // Show offline message
    console.log('socketio disconnect with reason ->', reason);
  });
}
export default feathersClient;
