import VuexPersistence from '@/../local_modules/vuex-persist';

// Modules you want to save to persistence
const modules = ['userPrefs']; // TODO: Add peristed modules here to localstorage CAUTION: Persisted in plain-text
const storageKey = `ls-${process.env.VUE_APP_NAME}`;
const vuexPersist = new VuexPersistence({
  storage: window.localStorage,
  key: storageKey,
  modules,
});

export default vuexPersist;
