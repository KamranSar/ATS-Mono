import Vue from 'vue';
import Vuex from 'vuex';

// Manually pull in template provided modules/plugins/services or middleware
import azureAuthentication from '@/config/private/azureAuthentication';
import azureDB from '@/config/private/azureDB';
import { FeathersVuex } from '@/config/private/feathers';

// Auto import all modules, plugins and services
import modules from '@/store/modules';
import plugins from '@/store/plugins';
import services from '@/store/services';

// Attach vuex to the vue instance
Vue.use(Vuex);
Vue.use(FeathersVuex);

const store = new Vuex.Store({
  modules: { ...modules, azureAuthentication },
  plugins: [...plugins, ...services, azureDB],
});

// initialization functions for each vuex store
// Adding await to the beginning of one makes it synchronous
store.dispatch('alert/init');
store.dispatch('app/init');
store.dispatch('appFeatures/init');
store.dispatch('azureAuthentication/init');
store.dispatch('snackbar/init');
store.dispatch('userPrefs/init');
store.dispatch('FeathersAuthentication/init');

if (process.env.NODE_ENV === 'development') {
  window.store = store; // Make store available from the console.
}
export default store;
