import VuexPersistence from '@/../local_modules/vuex-persist';

// Modules you want to save to persistence
const modules = ['userPrefs']; // TODO: Add peristed modules here to localstorage CAUTION: Persisted in plain-text
const storageKey = process.env.VUE_APP_NAME;
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
  modules: [...modules],
  filter: (mutation) => {
    return !modules.every((name) => {
      return !mutation.type.includes(name + '/');
    });
  },
});

export default vuexPersist;
