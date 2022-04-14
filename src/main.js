import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api'; // Remove when upgrading to Vue 3.0
import App from '@/App.vue';
import vuetify from '@/plugins/vuetify';
import router from '@/router';
import store from '@/store';
import '@cdcr/vue-frontend/main.js';
import { initServiceWorker } from '@/registerServiceWorker.js';
import '@mdi/font/css/materialdesignicons.css';

initServiceWorker();

Vue.config.productionTip = true;

Vue.prototype.$vuetify = vuetify;

Vue.use(VueCompositionAPI);

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
