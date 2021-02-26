import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api'; // Remove when upgrading to Vue 3.0
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { msalPlugin, msalConfig } from './plugins/msal';
import VTooltip from 'v-tooltip';

Vue.use(VueCompositionAPI); // Remove when upgrading to Vue 3.0

Vue.config.productionTip = false;

Vue.use(msalPlugin, msalConfig);

Vue.use(VTooltip);
// Vuetify tooltip is a pain.
// This should be removed when Vuetify has better tooltip

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
