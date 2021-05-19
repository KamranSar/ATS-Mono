import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api'; // Remove when upgrading to Vue 3.0
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import vuetify from '@/config/vuetify';
import VTooltip from 'v-tooltip';
import myApp from '@/config/myApp.js';
import feathersClient from '@/config/private/feathers.js';
import { initServiceWorker } from '@/registerServiceWorker.js';

import '@/acl/index.js';

initServiceWorker();

Vue.config.productionTip = true;

Vue.prototype.$myApp = myApp;
Vue.prototype.$feathers = feathersClient;

Vue.use(VueCompositionAPI);
Vue.use(VTooltip);
// Vuetify tooltip is a pain.
// This should be removed when Vuetify has better tooltip

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
