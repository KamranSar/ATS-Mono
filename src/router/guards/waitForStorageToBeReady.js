/**
 * Router Guards used by Vue-Router
 */

import store from '@/store';
import getNewToken from '@/config/private/helpers/getNewToken.js';
import hasARole from '@/helpers/hasARole.js';
import onInit from '@/config/hooks/onInit.js';
import myApp from '@/config/myApp.js';

let restoreCounter = 0; // Number of times waitForStorageToBeReady is called before next() is called
const TIMER_LABEL = 'Initialized in';

/**
 * waitForStorageToBeReady
 * Waits for the vuex modules to be restored from idb before routing to next();
 * Calls getNewToken after restoring all vuex modules
 * Once modules have been initialized, onInit() hook is called from @/config/hooks/
 *
 * The _REQUIRED_MODULES modules are restored first
 * Then the ORDERED_MODULES specified in @/config/hooks/onInit.js
 * Then the whatever order @/store/modules/index.js imports them as...
 *
 * @param {*} to
 * @param {*} from
 * @param {*} next
 */
const waitForStorageToBeReady = async (to, from, next) => {
  if (!restoreCounter) {
    console.log(`Initializing${myApp.name}, please wait...`);
    console.time(TIMER_LABEL);
  }
  restoreCounter++;
  if (restoreCounter === 1) {
    await Promise.all(store.restored); // Set by VuexPersist
    try {
      await getNewToken();
    } catch (error) {
      console.log(error);
    }
    await onInit();
    console.timeEnd(TIMER_LABEL);
  }

  // If the user has no roles then they should be taken to no access
  if (!hasARole() && to.name !== 'No Access' && to.name !== 'Login') {
    next({ name: 'No Access' });
  } else if (!store.getters['users/isUserLoggedIn'] && to.name !== 'Login') {
    next({ name: 'Login' });
  } else {
    next();
  }
};

export default waitForStorageToBeReady;
