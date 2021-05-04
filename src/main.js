import Vue from 'vue';
// https://vuex.feathersjs.com/composition-api.html#feathers-vuex-composition-api
import VueCompositionAPI from '@vue/composition-api'; // Remove when upgrading to Vue 3.0
// Register the Composition API plugin BEFORE you import App.vue
Vue.use(VueCompositionAPI); // Remove when upgrading to Vue 3.0

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import vuetify from '@/config/vuetify';
import VTooltip from 'v-tooltip';
import myApp from '@/config/myApp.js';
import { initServiceWorker } from '@/registerServiceWorker.js';

initServiceWorker();

Vue.config.productionTip = true;

Vue.prototype.$myApp = myApp;

Vue.use(VTooltip);
// Vuetify tooltip is a pain.
// This should be removed when Vuetify has better tooltip

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
