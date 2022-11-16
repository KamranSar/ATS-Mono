import { myApp } from '@/config/myApp.js';
import { CLIENT_ROLES_ENABLED } from '@/config/appFeatures.js';
import flatten from '@cdcr/vue-frontend/helpers/flatten.js';

const getters = {
  /**
   * isUserLoggedIn
   * Returns whether or not a user is logged in.
   *
   * @param {*} state
   * @returns {Boolean} - true|false whether or not the application user is logged in.
   */
  isUserLoggedIn: (state) => {
    if (state.loggedInUser && state.loggedInUser.displayName) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * getUserPrefs
   * Returns the userprefs from the loggedInUser
   * Returns mobile prefs when isMobile is true
   *
   * @param {*} state
   * @returns {Array} - state.loggedInUser.userprefs : {}
   */
  getUserPrefs: (state) => {
    if (
      state.loggedInUser &&
      state.loggedInUser.userprefs &&
      state.loggedInUser.userprefs[myApp.isMobile ? 'mobilePrefs' : 'prefs']
    ) {
      return state.loggedInUser.userprefs[
        myApp.isMobile ? 'mobilePrefs' : 'prefs'
      ];
    } else {
      return {};
    }
  },
  /**
   * getAppRoles
   * Returns all the roles defined for the application
   *
   * @param {*} state
   * @returns {Array} - state.loggedInUser.appinfo.roles || []
   */
  getAppRoles: (state, getters) => {
    /**
     * Remove the if conditional and keep the else when CLIENT_ROLES_ENABLED is removed
     * @deprecated > v0.6.0 vue-frontend-template
     */
    if (CLIENT_ROLES_ENABLED) {
      let appRoles = myApp.approles;
      appRoles.sort((a, b) => a.priority - b.priority);

      // Get user role and highest priority
      const appUserRoles = getters.getAppUserRoles.map((userRoleName) =>
        myApp.approles.find((role) => role.name === userRoleName)
      );
      const highestPriorityLevel = appUserRoles.length
        ? appUserRoles[0].priority
        : 9999; // It's over 9000!!!!

      // Filter out any roles that are of higher priority
      // Keep only roles of equal or lower priority
      appRoles = appRoles.filter((role) => {
        if (!highestPriorityLevel) {
          return false;
        }

        return role.priority >= highestPriorityLevel;
      });
      return appRoles;
    } else if (
      state.loggedInUser &&
      state.loggedInUser.appinfo &&
      state.loggedInUser.appinfo.roles &&
      state.loggedInUser.appinfo.roles.length
    ) {
      // FIXME: Return this in sorted order...
      // Remember to include priority when moving to backend.
      const userRoles = getters.appUserRoles;
      return state.loggedInUser.appinfo.roles.filter((r) =>
        userRoles.includes(r.name)
      );
    } else {
      return [];
    }
  },

  /**
   * A map of all the defined application roles keyed by name
   */
  getAppRolesMap(state, getters) {
    const appRoles = getters.getAppRoles;
    const appRolesMap = new Map();

    if (appRoles.length) {
      const flattenedRoles = flatten(appRoles);
      flattenedRoles.map((r) => appRolesMap.set(r.name, r));
    }

    return appRolesMap;
  },

  /**
   * getAppUserRoles
   * Returns the roles from the loggedInUser or an empty array
   *
   * @param {*} state
   * @returns {Array} - state.loggedInUser.appuserroles.roles || []
   */
  getAppUserRoles: (state) => {
    if (
      state.loggedInUser &&
      state.loggedInUser.appuserroles &&
      state.loggedInUser.appuserroles.roles &&
      state.loggedInUser.appuserroles.roles.length
    ) {
      let appUserRoles = state.loggedInUser.appuserroles.roles;
      /**
       * Remove this when CLIENT_ROLES_ENABLED is removed
       * @deprecated >v0.6.0 vue-frontend-template
       */
      if (CLIENT_ROLES_ENABLED) {
        // 1. Map to the defined role object in myApp.approles
        // 2. Sort by priority
        return appUserRoles.filter((userRoleName) =>
          myApp.approles.find((r) => r.name === userRoleName)
        );
      } else {
        return appUserRoles;
      }
    } else {
      return [];
    }
  },
};

export default getters;
