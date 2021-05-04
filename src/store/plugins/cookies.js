import VuexPersistence from '@/../local_modules/vuex-persist';
import Cookies from 'js-cookie';

// https://github.com/championswimmer/vuex-persist#detailed
// https://github.com/js-cookie/js-cookie
const modules = ['authentication']; // Modules you want to save to persistence

const vuexPersist = new VuexPersistence({
  key: `c.${process.env.VUE_APP_NAME}`, // The key to store the state on in the storage provider.
  restoreState: (key) => Cookies.getJSON(key),
  saveState: (key, state) => {
    return Cookies.set(key, state, {
      expires: 3, // Number of days to expire cookie in
    });
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
