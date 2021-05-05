import VuexPersistence from '@/../local_modules/vuex-persist';
import {
  knownToken,
  encryptData,
  decryptData,
} from '@/store/plugins/crypto.js';

const modules = ['userprefs', 'Users']; // Modules you want to save to persistence
const storageKey = `ls.${process.env.VUE_APP_NAME}`;
const PROD_ENV = process.env.NODE_ENV === 'production';
const vuexPersist = new VuexPersistence({
  storage: {
    getItem: async () => {
      // Get the store from local storage.
      let data = window.localStorage.getItem(storageKey);
      if (data && PROD_ENV) {
        try {
          // Decrypt data retrieved from local storage
          return await decryptData(data, knownToken.a, knownToken.b);
        } catch (e) {
          // FIXME: Do we want this?
          // Data will be reset if decryption fails.
          window.localStorage.removeItem(storageKey);
        }
      } else {
        // Not running in production, return unecrypted data
        return data;
      }
      return null;
    },
    setItem: async (key, value) => {
      let data = value;
      if (PROD_ENV) {
        // Encrypt the data in production
        data = await encryptData(value, knownToken.a, knownToken.b);
      }

      // Save the data in local storage.
      return window.localStorage.setItem(storageKey, data);
    },
  },
  modules: [...modules],
  // https://github.com/championswimmer/vuex-persist/issues/178
  filter: (mutation) => {
    return !modules.every((name) => {
      return !mutation.type.includes(name + '/');
    });
  },
});

export default vuexPersist;
