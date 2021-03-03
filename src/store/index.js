import Vue from 'vue';
import Vuex from 'vuex';
import pathify from '@/plugins/vuex-pathify';

import VuexPersistence from 'vuex-persist';
import Cookies from 'js-cookie';
import localForage from 'localforage';

// Modules
import * as modules from './modules';

Vue.use(Vuex);

// https://github.com/championswimmer/vuex-persist#detailed
// https://github.com/js-cookie/js-cookie
const vuexCookie = new VuexPersistence({
  key: 'cookieStore', // The key to store the state on in the storage provider.
  restoreState: (key) => Cookies.getJSON(key),
  saveState: (key, state) => {
    return Cookies.set(key, state, {
      expires: 3, // Number of days to expire cookie in
    });
  },
  modules: ['authentication'], //only save user module
  // https://github.com/championswimmer/vuex-persist/issues/178
  filter: (mutation) => mutation.type.includes('authentication/'), // Method to filter which mutations will trigger state saving
});

const vuexLocal = new VuexPersistence({
  key: 'localStore', // The key to store the state on in the storage provider.
  storage: window.localStorage, // or window.sessionStorage or localForage
  modules: ['serviceReq', 'userprefs'], // Dont include app
  // reducer: (state) => ({ dog: state.dog }),
  filter: (mutation) =>
    mutation.type.includes('userprefs/') ||
    mutation.type.includes('serviceReq/'), // Method to filter which mutations will trigger state saving
});

const vuexIndexdb = new VuexPersistence({
  key: 'indexdbStore', // The key to store the state on in the storage provider.
  storage: localForage, // or window.sessionStorage or localForage
  asyncStorage: true,
  // Define custom set/get for state so we can log what's getting saved/restored
  restoreState: (key) => {
    // console.log(key + '_restored');
    return localForage.getItem(key);
  },
  saveState: (key, state) => {
    // console.log(key + '_saved');
    // console.log(state);
    return localForage.setItem(key, state);
  },

  modules: ['azureAuthentication'],
  // reducer: (state) => ({ azureAuthentication: state.azureAuthentication }),
  filter: (mutation) => mutation.type.includes('azureAuthentication/'), // Method to filter which mutations will trigger state saving
  // filter: (
  //   mutation // {
  // ) =>
  //   mutation.type == 'azureAuthentication/azuretokenresponse' ||
  //   mutation.type == 'azureAuthentication/SET_MY_INFO' ||
  //   mutation.type == 'azureAuthentication/SET_MY_PHOTO' ||
  //   mutation.type == 'azureAuthentication/SET_MY_PHOTO_META_DATA',
});

const store = new Vuex.Store({
  modules,
  plugins: [
    pathify.plugin,
    vuexCookie.plugin,
    vuexLocal.plugin,
    vuexIndexdb.plugin,
  ],
});

store.dispatch('app/init');
// store.dispatch('azureAuthentication/signIn', 'loginPopup');
// store.dispatch('azureAuthentication/AzureAuthentication');

if (process.env.NODE_ENV === 'development') {
  window.store = store; // Make store available from the console.
}
export default store;

export const ROOT_DISPATCH = Object.freeze({ root: true });
