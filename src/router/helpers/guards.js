// https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
import Vue from 'vue';
import store from '@/store/index';
import getNewToken from '@/config/private/helpers/getNewToken';

const requireToken = (to, from, next) => {
  const loggedIn = store.get('azureAuthentication/isAzureLoggedIn');
  if (loggedIn) next();
  else {
    console.log('router guard - no token - redirect to Login screen');
    next({ name: 'Login' });
  }
};

let previouslyRestored = false;
const waitForStorageToBeReady = async (to, from, next) => {
  try {
    await Promise.all(store.restored); // Set by VuexPersist
    if (!previouslyRestored) {
      // TODO: Add your custom initialization code here : do the things you want to do only once after the store is restored

      // Usecase 1: Get a new token on a refresh if user is logged in.
      const loggedIn = store.get('azureAuthentication/isAzureLoggedIn');
      console.log('loggedIn at startup ', loggedIn);
      if (loggedIn) await getNewToken();

      // Usecase 2: Set user's theme preference on refresh
      // NOTE: Persisting userPrefs to localStorage/cookies won't work when also
      // persisting darkMode because it of conflicts in the lifecyle
      Vue.prototype.$vuetify.framework.theme.dark =
        store.get('userPrefs/darkMode');

      // Usecase 3: Set the current route path in localstorage
      // If doing a auth, user is directed to dashboard,
      // and dashboard will read the redirect key in localstorage
      // TODO: Test me if this works...
      window.localStorage.setItem('redirect', JSON.stringify(from.fullPath));

      previouslyRestored = true;
    }
  } catch (e) {
    previouslyRestored = true;
  }
  next();
};

export { requireToken, waitForStorageToBeReady };
