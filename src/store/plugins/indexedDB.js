import VuexPersistence from '@/../local_modules/vuex-persist';
import localForage from 'localforage';
import pako from 'pako';

const APP_NAME = process.env.VUE_APP_NAME;
const PROD_ENV = process.env.NODE_ENV === 'production';

const modules = ['users', 'userPrefs']; // TODO: Add any modules you want to save to persistence

// https://localforage.github.io/localForage/#multiple-instances-createinstance
const localForageInstance = localForage.createInstance({
  name: APP_NAME,
  storeName: 'appDatabase',
});

const vuexPersisted = [];
modules.forEach((key) => {
  const vuexPersist = new VuexPersistence({
    key,
    storage: localForageInstance, // or window.sessionStorage, window.localStorage, or localForage
    asyncStorage: true,
    restoreState: async (key) => {
      try {
        let data = await localForageInstance.getItem(key);
        console.log('data: ', data);
        if (PROD_ENV) {
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
        if (PROD_ENV) {
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
