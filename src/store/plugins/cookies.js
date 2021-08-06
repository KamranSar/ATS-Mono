import VuexPersistence from '@/../local_modules/vuex-persist/esm/';
import Cookies from 'js-cookie';

// https://github.com/championswimmer/vuex-persist#detailed
// https://github.com/js-cookie/js-cookie
const modules = []; // TODO: Add peristed modules here to localstorage

// !CAUTION: Persisted in plain-text
const vuexPersist = new VuexPersistence({
  key: process.env.VUE_APP_NAME, // The key to store the state on in the storage provider.
  restoreState: (key) => {
    const data = JSON.parse(Cookies.get(key));
    // console.log('Restore: ', data);
    return data;
  },
  saveState: (key, state) => {
    const data = Cookies.set(key, JSON.stringify(state), {
      expires: 3, // Number of days to expire cookie in
    });
    // console.log('Save: ', data);
    return data;
  },
  modules,
});

export default vuexPersist;
