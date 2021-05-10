import VuexPersistence from '@/../local_modules/vuex-persist';
import localForage from 'localforage';
import pako from 'pako';

const APP_NAME = process.env.VUE_APP_NAME;
const PROD_ENV = process.env.NODE_ENV === 'production';

const modules = ['Users', 'userPrefs']; // TODO: Add any modules you want to save to persistence

// https://localforage.github.io/localForage/#multiple-instances-createinstance
const localForageInstance = localForage.createInstance({
  name: APP_NAME,
  storeName: 'appDatabase',
});

const vuexPersist = new VuexPersistence({
  key: APP_NAME,
  asyncStorage: true,
  restoreState: async (key) => {
    try {
      let data = await localForageInstance.getItem(key);
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
      const savedState = [];
      Object.keys(state).forEach((moduleName) => {
        let data = state[moduleName];
        if (PROD_ENV) {
          data = new TextEncoder().encode(JSON.stringify(data));
          data = pako.deflate(data, { level: 6 });
        }
        savedState.push(localForageInstance.setItem(moduleName, data));
      });
      return await Promise.all(savedState);
    } catch (error) {
      return error;
    }
  },
  modules: [...modules],
  filter: (mutation) => {
    return !modules.every((name) => {
      return !mutation.type.includes(name + '/');
    });
  },
});
export default vuexPersist;
