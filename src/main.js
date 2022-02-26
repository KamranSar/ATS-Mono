import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api'; // Remove when upgrading to Vue 3.0
import App from '@/App.vue';
import vuetify from '@/plugins/vuetify';
import router from '@/router';
import store from '@/store';
import myApp from '@/config/myApp.js';
import feathersClient from '@/feathers/index.js';
import { VueMaskDirective } from 'v-mask';
import { initServiceWorker } from '@/registerServiceWorker.js';
import { getNewToken } from '@/config/private/helpers/index.js';
import '@mdi/font/css/materialdesignicons.css';

/**
 * Make global our hasAnyRoles and hasAllRoles directives and helpers
 */
import '@/directives/v-has-any-roles';
import '@/directives/v-has-all-roles';
import { hasARole, hasAllRoles, hasAnyRoles } from '@/helpers/index.js';

initServiceWorker();

Vue.config.productionTip = true;

Vue.prototype.$myApp = myApp;
Vue.prototype.$hasARole = hasARole;
Vue.prototype.$hasAllRoles = hasAllRoles;
Vue.prototype.$hasAnyRoles = hasAnyRoles;
Vue.prototype.$feathers = feathersClient;
Vue.prototype.$vuetify = vuetify;

Vue.use(VueCompositionAPI);
Vue.directive('mask', VueMaskDirective);

new Vue({
  vuetify,
  router,
  store,
  data: () => ({
    keepAliveInterval: null,
  }),
  created() {
    // Create the first one, and toggle it between visibility changes.
    this.createKeepAlive();

    // console.log('Created First Interval: ', this.keepAliveInterval);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.createKeepAlive();
        console.log('Visible Activated: ', this.keepAliveInterval);
      } else if (this.keepAliveInterval) {
        clearInterval(this.keepAliveInterval);
        console.log('Visible Hidden: ', this.keepAliveInterval);
      }
    });
  },
  methods: {
    createKeepAlive() {
      // handle the case where the visibility changes.
      // When we come back, we must check for a token before anything
      // else happens in the app or API's could fail
      // Skip this for page refreshes. It's handled in the router guards
      const hours = 0.5 * 1000 * 60 * 60; // Get a new token every 0.5 hours.
      this.keepAliveInterval = setInterval(() => {
        getNewToken();
      }, hours);
    },
  },
  render: (h) => h(App),
}).$mount('#app');
