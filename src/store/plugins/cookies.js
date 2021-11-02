// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies
// https://github.com/championswimmer/vuex-persist#detailed
// https://github.com/js-cookie/js-cookie

import VuexPersistence from '@/../local_modules/vuex-persist/esm/';
import Cookies from 'js-cookie';
import { getPersistedModules } from '@/helpers/index.js';
const modules = getPersistedModules('cookies');

// !CAUTION: Persisted in plain-text
const vuexPersist = new VuexPersistence({
  key: process.env.VUE_APP_NAME, // The key to store the state on in the storage provider.
  restoreState: (key) => {
    const cookieData = Cookies.get(key);
    const data = cookieData ? JSON.parse(cookieData) : null;
    // console.log('Restore: ', data);
    return data;
  },
  saveState: (key, state) => {
    // console.log({ state });
    if (state && Object.keys(state).length) {
      const cookieData = JSON.stringify(state);
      const data = Cookies.set(key, cookieData, {
        expires: 3, // Number of days to expire cookie in
      });
      // console.log('Save: ', data);
      return data;
    }
  },
  modules,
});

export default vuexPersist;
