import VuexPersistence from '@/../local_modules/vuex-persist';
import localForage from 'localforage';

// https://localforage.github.io/localForage/#multiple-instances-createinstance
const localForageInstance = localForage.createInstance({
  name: 'appDatabase', // database name
  storeName: 'indexeddbkeys', // table name
});

const modules = []; // Modules you want to save to persistence

const vuexPersist = new VuexPersistence({
  key: `idb.${process.env.VUE_APP_NAME}`, // The key to store the state on in the storage provider.
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
