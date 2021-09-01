/**
 * Router Guards used by Vue-Router
 */

import store from '@/store';
import getNewToken from '@/config/private/helpers/getNewToken.js';
import hasARole from '@/helpers/hasARole.js';

let previouslyRestored = false;
/**
 * waitForStorageToBeReady
 * Waits for the vuex modules to be restored from idb before routing to next();
 *
 * @param {*} to
 * @param {*} from
 * @param {*} next
 */
const waitForStorageToBeReady = async (to, from, next) => {
  try {
    // console.log('store.restored: ', store.restored);
    // console.log('store: ', store);
    await Promise.all(store.restored); // Set by VuexPersist
    if (!previouslyRestored) {
      // Get a new token on a page refresh if user is logged in.
      // When a page received focus or is hidden, get a new token in main.js
      await getNewToken();

      previouslyRestored = true;
    }
  } catch (e) {
    previouslyRestored = true;
  }

  // If we're routing to Login or user has roles..
  if (to.name === 'Login' || hasARole()) {
    next();
  } else if (to.name !== 'No Access' && !hasARole()) {
    // If user has no roles, then route them to no access
    next({ name: 'No Access' });
  } else {
    next();
  }
};

export default waitForStorageToBeReady;
