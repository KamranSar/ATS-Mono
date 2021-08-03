import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api'; // Remove when upgrading to Vue 3.0
import App from '@/App.vue';
import vuetify from '@/plugins/vuetify';
import router from '@/router';
import store from '@/store';
import myApp from '@/config/myApp.js';
import feathersClient from '@/feathers/index.js';
import { initServiceWorker } from '@/registerServiceWorker.js';
import getNewToken from '@/config/private/helpers/getNewToken';

import '@/acl/index.js';

initServiceWorker();

Vue.config.productionTip = true;

Vue.prototype.$myApp = myApp;
Vue.prototype.$feathers = feathersClient;
Vue.prototype.$vuetify = vuetify;

Vue.use(VueCompositionAPI);

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

// Get a new token every 20 seconds.
let keepAliveInterval = null;
let appInitialized = false;
const createKeepAlive = () => {
  // handle the case where the visibility changes.
  // When we come back, we must check for a token before anything
  // else happens in the app or API's could fail
  // Skip this for page refreshes. It's handled in the router guards (guards.js)
  if (appInitialized) {
    getNewToken();
  }
  appInitialized = true;
  keepAliveInterval = setInterval(() => {
    getNewToken();
  }, 20 * 1000);
};

// Create the first one, and toggle it between visibility changes.
createKeepAlive();

// console.log('Created First Interval: ', keepAliveInterval);
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    createKeepAlive();
    console.log('Visible Activated: ', keepAliveInterval);
  } else if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    console.log('Visible Hidden: ', keepAliveInterval);
  }
});
