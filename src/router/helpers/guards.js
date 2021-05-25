// https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
import Vue from 'vue';
import store from '@/store/index';
import feathers from '@/config/private/feathers.js';
import getNewToken from '@/feathers/hooks/getNewToken';

const requireToken = (to, from, next) => {
  const token = store.get('azureAuthentication/azuretokenresponse');
  if (token) next();
  else next({ name: 'Login' });
};

const requireAuth = (to, from, next) => {
  const loggedIn = store.get('azureAuthentication/isAzureLoggedIn');
  if (loggedIn) next();
  else next({ name: 'Login' });
};

let previouslyRestored = false;
const waitForStorageToBeReady = async (to, from, next) => {
  try {
    await Promise.all(store.restored); // Set by VuexPersist
    if (!previouslyRestored) {
      // TODO: Add your custom initialization code here : do the things you want to do only once after the store is restored

      // Usecase 1: Get a new token on a refresh if user is logged in.
      const loggedIn = store.get('azureAuthentication/isAzureLoggedIn');
      if (loggedIn) await getNewToken({ app: feathers });

      // Usecase 2: Set user's theme preference on refresh
      // NOTE: Persisting userPrefs to localStorage/cookies won't work when also
      // persisting darkMode because it of conflicts in the lifecyle
      Vue.prototype.$vuetify.framework.theme.dark =
        store.get('userPrefs/darkMode');

      previouslyRestored = true;
    }
  } catch (e) {
    previouslyRestored = true;
  }
  next();
};

export { requireToken, requireAuth, waitForStorageToBeReady };
