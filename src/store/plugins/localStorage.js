// https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

import VuexPersistence from '@/../local_modules/vuex-persist/esm/';
import { getPersistedModules } from '@/helpers/index.js';
const modules = getPersistedModules('localStorage');
const storageKey = `ls-${process.env.VUE_APP_NAME}`;
const vuexPersist = new VuexPersistence({
  storage: window.localStorage,
  key: storageKey,
  modules,
});

export default vuexPersist;
