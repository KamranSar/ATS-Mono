import Vue from 'vue';
import Vuex from 'vuex';
import pathify from 'vuex-pathify';

import VuexPersist from 'vuex-persist';
import Cookies from 'js-cookie';

// Modules
import * as modules from './modules';

Vue.use(Vuex);

// https://github.com/championswimmer/vuex-persist#detailed
// https://github.com/js-cookie/js-cookie
const vuexCookie = new VuexPersist({
  key: 'cookieStore', // The key to store the state on in the storage provider.
  restoreState: (key) => Cookies.getJSON(key),
  saveState: (key, state) =>
    Cookies.set(key, state, {
      expires: 3, // Number of days to expire cookie in
    }),
  modules: ['authentication'], //only save user module
  // filter: (mutation) => mutation.type == 'logIn' || mutation.type == 'logOut'
});

const vuexLocal = new VuexPersist({
  key: 'localStore', // The key to store the state on in the storage provider.
  storage: localStorage, // or window.sessionStorage or localForage
  modules: ['serviceReq', 'userprefs'], // Dont include appfeatures
});

const store = new Vuex.Store({
  modules,
  plugins: [pathify.plugin, vuexCookie.plugin, vuexLocal.plugin],
});

store.dispatch('app/init');
store.dispatch('azureAuthentication/signIn', 'loginPopup');
window.store = store;

export default store;

export const ROOT_DISPATCH = Object.freeze({ root: true });
