// developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage

import VuexPersistence from '@/../local_modules/vuex-persist/esm/';

const modules = []; // TODO: Add peristed modules here to localstorage

// !CAUTION: Persisted in plain-text
const vuexPersist = new VuexPersistence({
  key: process.env.VUE_APP_NAME, // The key to store the state on in the storage provider.
  restoreState: (key) => {
    const sessionData = sessionStorage.getItem(key);
    const data = sessionData ? JSON.parse(sessionData) : null;
    // console.log('Restore: ', data);
    return data;
  },
  saveState: (key, state) => {
    // console.log({ state });
    if (state && Object.keys(state).length) {
      const sessionData = JSON.stringify(state);
      const data = sessionStorage.setItem(key, sessionData);
      // console.log('Save: ', data);
      return data;
    }
  },
  modules,
});

export default vuexPersist;
