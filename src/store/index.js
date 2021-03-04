import Vue from 'vue';
import Vuex from 'vuex';
import pathify from '@/plugins/vuex-pathify';

import VuexPersistence from 'vuex-persist';
import Cookies from 'js-cookie';
import localForage from 'localforage';

// Modules
import * as modules from './modules';

// https://localforage.github.io/localForage/#multiple-instances-createinstance
const dbName = 'appDatabaseName'; // indexedDB database name

var localForageForAzure = localForage.createInstance({
  name: dbName,
  storeName: 'azureInfo', // table name
});

var localForageForServices = localForage.createInstance({
  name: dbName,
  storeName: 'serviceReq', // table name
});

// Attach vuex to the vue instance
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
  storage: window.localStorage, // or window.sessionStorage, window.localStorage, or localForage
  modules: ['userprefs'], // Dont include app
  filter: (mutation) => mutation.type.includes('userprefs/'), // Method to filter which mutations will trigger state saving
});

const vuexServices = new VuexPersistence({
  key: 'serviceReq', // The key to store the state on in the storage provider.
  storage: localForageForServices, // or window.sessionStorage, window.localStorage, or localForage
  asyncStorage: true, // needed for localforage
  modules: ['serviceReq'], // Dont include app
  filter: (mutation) => mutation.type.includes('serviceReq/'), // Method to filter which mutations will trigger state saving
});

const vuexIndexdb = new VuexPersistence({
  key: 'azureAuthentication', // The key to store the state on in the storage provider.
  storage: localForageForAzure, // or window.sessionStorage, window.localStorage, or localForage
  asyncStorage: true, // needed for localforage
  restoreState: (key) => {
    localForageForAzure.getItem(key).then((state) => {
      // You can manipulate the state here before it is restored - such as decrypt certain keys
      console.log(state);
      return state;
    });
    return localForageForAzure.getItem(key);
  },
  saveState: (key, state) => {
    // You can manipulate the state here before it goes into the database - such as encrypt certain keys
    console.log(key, state);
    return localForageForAzure.setItem(key, state);
  },
  // modules: ['azureAuthentication'],
  // strip the state for azure down to only the fields we care about
  reducer: (state) => ({
    azureAuthentication: {
      azuretokenresponse: state.azureAuthentication.azuretokenresponse,
      myInfo: state.azureAuthentication.myInfo,
      myPhoto: state.azureAuthentication.myPhoto,
      myPhotoMetaData: state.azureAuthentication.myPhotoMetaData,
    },
  }),
  filter: (mutation) => mutation.type.includes('azureAuthentication/'), // Method to filter which mutations will trigger state saving
});

const store = new Vuex.Store({
  modules,
  plugins: [
    pathify.plugin,
    vuexCookie.plugin,
    vuexLocal.plugin,
    vuexIndexdb.plugin,
    vuexServices.plugin,
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

// export const ROOT_DISPATCH = Object.freeze({ root: true });
