import VuexPersistence from '@/../local_modules/vuex-persist';
import localForage from 'localforage';

// https://localforage.github.io/localForage/#multiple-instances-createinstance
const localForageInstance = localForage.createInstance({
  name: 'appDatabase', // database name
  storeName: 'serviceReq', // table name
});

const modules = ['serviceReq']; // Modules you want to save to persistence

const vuexPersist = new VuexPersistence({
  key: 'keys', // The key to store the state on in the storage provider.
  storage: localForageInstance, // or window.sessionStorage, window.localStorage, or localForage
  asyncStorage: true, // needed for localforage
  modules: [...modules],
  filter: (mutation) => {
    return !modules.every((name) => {
      return !mutation.type.includes(name + '/');
    });
  },
});

export default vuexPersist;
