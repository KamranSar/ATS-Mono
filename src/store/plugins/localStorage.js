import VuexPersistence from '@/../local_modules/vuex-persist';

// Modules you want to save to persistence
const modules = []; // TODO: Add peristed modules here to localstorage CAUTION: Persisted in plain-text
const storageKey = `ls-${process.env.VUE_APP_NAME}`;
const vuexPersist = new VuexPersistence({
  storage: {
    getItem: async () => {
      let data = window.localStorage.getItem(storageKey); // Get the store from local storage.
      if (data) return data;
      return null;
    },
    setItem: async (key, value) => {
      return window.localStorage.setItem(storageKey, value); // Save the data in local storage.
    },
  },
  modules,
});

export default vuexPersist;
