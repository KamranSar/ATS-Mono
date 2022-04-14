import Vue from 'vue';
import Vuex from 'vuex';

// Auto import all modules, plugins and services
import requiredModules from '@cdcr/vue-frontend/store/modules';
import appModules from '@/store/modules';
import plugins from '@cdcr/vue-frontend/store/plugins';

// Attach vuex to the vue instance
Vue.use(Vuex);

const storeModules = { ...requiredModules, ...appModules };
const store = new Vuex.Store({
  modules: storeModules,
  plugins: [...plugins],
});

// TODO: How to guarantee application data during refresh.
if (process.env.NODE_ENV === 'development') {
  window.store = store; // Make store available from the console.
}
export default store;
