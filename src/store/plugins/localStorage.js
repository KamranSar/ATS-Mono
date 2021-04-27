import VuexPersistence from '@/../local_modules/vuex-persist';

const modules = ['userprefs', 'users']; // Modules you want to save to persistence

const vuexPersist = new VuexPersistence({
  key: 'appLocalStore', // The key to store the state on in the storage provider. // FIXME: Dynamic localstorage persistence per model
  storage: window.localStorage, // or window.sessionStorage, window.localStorage, or localForage
  modules: [...modules],
  // https://github.com/championswimmer/vuex-persist/issues/178
  filter: (mutation) => {
    return !modules.every((name) => {
      return !mutation.type.includes(name + '/');
    });
  },
});

export default vuexPersist;
