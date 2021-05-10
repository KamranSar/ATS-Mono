import VuexPersistence from '@/../local_modules/vuex-persist';
import Cookies from 'js-cookie';

// https://github.com/championswimmer/vuex-persist#detailed
// https://github.com/js-cookie/js-cookie
const modules = []; // TODO: Add peristed modules here to localstorage CAUTION: Persisted in plain-text

const vuexPersist = new VuexPersistence({
  key: process.env.VUE_APP_NAME, // The key to store the state on in the storage provider.
  restoreState: (key) => Cookies.getJSON(key),
  saveState: (key, state) => {
    return Cookies.set(key, state, {
      expires: 3, // Number of days to expire cookie in
    });
  },
  modules: [...modules],
  filter: (mutation) => {
    return !modules.every((name) => {
      return !mutation.type.includes(name + '/');
    });
  },
});

export default vuexPersist;
