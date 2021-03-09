import Vue from 'vue';
import Vuex from 'vuex';
import pathify from '@/plugins/vuex-pathify';

// Modules
import * as modules from './modules';

// plugins
import cookiePlugin from './plugins/cookies';
import localStorage from './plugins/localStorage';
import indexedDB from './plugins/indexedDB';
import azureDB from './plugins/azureDB';

// Attach vuex to the vue instance
Vue.use(Vuex);

const store = new Vuex.Store({
  modules,
  plugins: [
    pathify.plugin,
    // Register the custom persistence plugins
    cookiePlugin.plugin,
    localStorage.plugin,
    azureDB.plugin,
    indexedDB.plugin,
  ],
});

// initialization functions for each vuex store
// Adding await to the beginning of one makes it synchronous
store.dispatch('alert/init');
store.dispatch('app/init');
store.dispatch('appfeatures/init');
store.dispatch('authentication/init');
store.dispatch('azureAuthentication/init');
store.dispatch('serviceReq/init');
store.dispatch('snackbar/init');
store.dispatch('userprefs/init');

if (process.env.NODE_ENV === 'development') {
  window.store = store; // Make store available from the console.
}
export default store;
