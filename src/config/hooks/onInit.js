/**
 * This hook is called AFTER waitForStorageToBeReady in the VueRouter beforeEach hook.
 *
 * If the order of your vuex modules matter during the initializion stage
 * then pass in the name of your module into the Array to dictate that order.
 * @example
 * As a working example, the following modules are restored
 * in their respective orders within initModules.js...
 * const _REQUIRED_MODULES = ['users', 'app', 'userPrefs', 'devicePrefs']
 *
 * @type {Array[String]} - The name of your module within vuex
 */
const ORDERED_MODULES = []; // Pass in your module name if order matters during init

import initModules from '@/config/private/helpers/initModules.js';
// import router from '@/router/index.js';
export default async () => {
  await initModules(ORDERED_MODULES);

  // Add your custom onInit logic here...
  // console.log('onInit()');
  /*   console.log('app initialized');
  store.set('app/loading', true);
  if (store.state.userPrefs && 'tosAgreed' in store.state.userPrefs && !store.state.userPrefs.tosAgreed) {
    router.push({ name: 'No Access' });
  } else {
    router.push({ name: 'Home' });
  }
  store.set('app/loading', true); */
};

export { ORDERED_MODULES };
