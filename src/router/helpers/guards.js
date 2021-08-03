// https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
// import Vue from 'vue';
import store from '@/store/index';
import getNewToken from '@/config/private/helpers/getNewToken';

const requireToken = (to, from, next) => {
  const loggedIn = store.get('users/isUserLoggedIn');
  if (loggedIn) next();
  else {
    // console.log('router guard - no token - redirect to Login screen');
    next({ name: 'Login' });
  }
};

let previouslyRestored = false;
const waitForStorageToBeReady = async (to, from, next) => {
  try {
    // console.log('store.restored: ', store.restored);
    // console.log('store: ', store);
    await Promise.all(store.restored); // Set by VuexPersist
    if (!previouslyRestored) {
      // TODO: Add your custom initialization code here : do the things you want to do only once after the store is restored

      // Usecase 1: Get a new token on a page refresh if user is logged in.
      // When a page received focus or is hidden, get a new token in main.js
      await getNewToken();

      previouslyRestored = true;
    }
  } catch (e) {
    previouslyRestored = true;
  }
  next();
};

export { requireToken, waitForStorageToBeReady };
