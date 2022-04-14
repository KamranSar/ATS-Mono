import { myApp } from '@/config/myApp.js';
import userPrefsService from '@cdcr/vue-frontend/feathers/services/userprefs/userprefs.service.js';

const actions = {
  saveUserPrefs: async ({ state, rootState }) => {
    try {
      rootState.app.loading = true;
      const loggedInUserPrefs =
        rootState.users.loggedInUser && rootState.users.loggedInUser.userprefs;

      if (myApp.isMobile) {
        loggedInUserPrefs.mobilePrefs = {
          ...state,
        };
      } else {
        loggedInUserPrefs.prefs = {
          ...state,
        };
      }
      await userPrefsService.patch(loggedInUserPrefs._id, loggedInUserPrefs);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },

  /**
   * * Note 1: The userPrefs init function comes pre-coded to set userPrefs based on field value pairs.
   * * Note 2: The userPrefs also comes with logic to set dark theme based on device preferences.
   * https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
   */
  init: async ({ rootState, state }) => {
    // Grab the user prefs for mobile or desktop
    const DEVICE_PREFS = myApp.isMobile ? 'mobilePrefs' : 'prefs';
    const loggedInUserPrefs =
      rootState.users.loggedInUser.userprefs &&
      rootState.users.loggedInUser.userprefs[DEVICE_PREFS]
        ? rootState.users.loggedInUser.userprefs[DEVICE_PREFS]
        : {};

    // Dynamically set the field values for the users defaultState
    Object.keys(loggedInUserPrefs).forEach((pref) => {
      state[pref] = loggedInUserPrefs[pref];
    });

    /**
     * Match media device logic:
     * Check user device theme preferences and
     * set a listener in case they change it on their device again...
     */
    const mediaListener = window.matchMedia('(prefers-color-scheme: dark)');
    const mediaHandler = (e) => {
      if (state.deviceTheme) {
        if (e.matches) {
          // console.log('Dark mode');
          rootState.devicePrefs.darkMode = true;
        } else {
          // console.log('Light mode');
          rootState.devicePrefs.darkMode = false;
        }
      }
    };
    mediaHandler(mediaListener, rootState);
    mediaListener.addEventListener('change', mediaHandler);

    // Add any more logic you require for your application below:
  },
};

export default actions;
