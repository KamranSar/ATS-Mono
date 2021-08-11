// https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
// import Vue from 'vue';
import store from '@/store/index';
import getNewToken from '@/config/private/helpers/getNewToken';
import myApp from '@/config/myApp.js';
/**
 * hasAppRoles
 * This is a guard helper to check for user has roles before continuing
 */
const hasAppRoles = (to, from, next) => {
  const loggedInUser = store.get('users/loggedInUser');
  let validRoles = false;
  // console.log({ loggedInUser });
  if (
    loggedInUser &&
    loggedInUser.appuserroles &&
    loggedInUser.appuserroles.roles &&
    loggedInUser.appuserroles.roles.length
  ) {
    // Loop through to make sure those roles are still valid to the app
    const appRoles = myApp.approles.map((appRole) => appRole.name); // Flatten the current valid list of approles
    // console.log({ appRoles });
    for (
      let index = 0;
      index < loggedInUser.appuserroles.roles.length;
      index++
    ) {
      const userRole = loggedInUser.appuserroles.roles[index];
      // console.log({ userRole });
      // If at least one of them is valid, we're good.
      if (appRoles.includes(userRole)) {
        validRoles = true;
        return true;
      }
    }
  }

  return validRoles;
};

let previouslyRestored = false;
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
  // *still follows beforeEnter rules*
  if (to.name === 'Login' || hasAppRoles()) {
    next();
  } else if (to.name !== 'No Access' && !hasAppRoles()) {
    // If user has no roles, then route them to no access
    next({ name: 'No Access' });
  } else {
    next();
  }
};

export { hasAppRoles, waitForStorageToBeReady };
