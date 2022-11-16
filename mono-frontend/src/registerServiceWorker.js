/* eslint-disable no-console */
const debug = require('debug')(
  `${process.env.VUE_APP_NAME}:` + 'registerServiceWorker'
);

import { register } from 'register-service-worker';

function initServiceWorker() {
  const useSW = process.env.NODE_ENV === 'production';
  if (useSW) {
    register(`${process.env.BASE_URL}service-worker.js`, {
      ready() {
        debug(
          'App is being served from cache by a service worker.\n' +
            'For more details, visit https://goo.gl/AFskqB'
        );
      },
      registered() {
        debug('Service worker has been registered.');
      },
      cached() {
        debug('Content has been cached for offline use.');
      },
      updatefound() {
        debug('New content is downloading.');
      },
      updated(registration) {
        debug('New content is available; please refresh.');
        document.dispatchEvent(
          new CustomEvent('swUpdated', { detail: registration })
        );
      },
      offline() {
        debug('No internet connection found. App is running in offline mode.');
      },
      error(error) {
        console.error('Error during service worker registration:', error);
      },
    });
  }
}

export { initServiceWorker };
