import Vue from 'vue';
import Vuex from 'vuex';

// Manually pull in template provided modules/plugins/services or middleware
import azureAuthentication from '@/config/private/store/modules/azure/index.js';
import azureDB from '@/config/private/store/plugins/azureDB';

// Auto import all modules, plugins and services
import modules from '@/store/modules';
import plugins from '@/store/plugins';

// Attach vuex to the vue instance
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: { ...modules, azureAuthentication },
  plugins: [...plugins, azureDB],
});

// initialization functions for each vuex store
// Adding await to the beginning of one makes it synchronous
store.dispatch('app/init');
store.dispatch('azureAuthentication/init');
store.dispatch('userPrefs/init');

// TODO: How to guarantee application data during refresh.
if (process.env.NODE_ENV === 'development') {
  window.store = store; // Make store available from the console.
}
export default store;
