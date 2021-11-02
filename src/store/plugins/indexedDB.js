// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

import VuexPersistence from '@/../local_modules/vuex-persist/esm/';
import localForage from 'localforage';
import pako from 'pako';
import myApp from '@/config/myApp.js';
import { getPersistedModules } from '@/helpers/index.js';
const modules = getPersistedModules('indexedDB');

// https://localforage.github.io/localForage/#multiple-instances-createinstance
const localForageInstance = localForage.createInstance({
  name: process.env.VUE_APP_NAME,
  storeName: 'appDatabase',
});

const ENCRYPTING = myApp.isTst || myApp.isPoc || myApp.isPrd;

const vuexPersisted = [];
modules.forEach((key) => {
  const vuexPersist = new VuexPersistence({
    key,
    storage: localForageInstance, // or window.sessionStorage, window.localStorage, or localForage
    asyncStorage: true,
    restoreState: async (key) => {
      try {
        let data = await localForageInstance.getItem(key);
        if (ENCRYPTING) {
          data = pako.inflate(data, { level: 6 });
          data = JSON.parse(new TextDecoder('utf-8').decode(data));
        }
        return data;
      } catch (error) {
        return error;
      }
    },
    saveState: async (key, state) => {
      try {
        let data = state;
        if (ENCRYPTING) {
          data = new TextEncoder().encode(JSON.stringify(state));
          data = pako.deflate(data, { level: 6 });
        }
        return localForageInstance.setItem(key, data);
      } catch (error) {
        return error;
      }
    },
    modules: [key],
  });

  vuexPersisted.push(vuexPersist.plugin);
});
export default vuexPersisted;
