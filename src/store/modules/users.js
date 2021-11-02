/* eslint-disable no-unused-vars */
import myApp from '@/config/myApp.js';
import { make } from 'vuex-pathify';

const getDefaultState = () => {
  return {
    loggedInUser: {}, // Required
  };
};

const state = getDefaultState();

const mutations = {
  ...make.mutations(state),

  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

// https://docs.feathersjs.com/api/services.html#service-methods
const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
    //
  },
  find: async (context, params) => {},
  get: async (context, id, params) => {},
  create: async (context, data, params) => {},
  update: async (context, id, data, params) => {},
  patch: async (context, id, data, params) => {},
  remove: async (context, id, params) => {},
};

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
      return state.loggedInUser.appuserroles.roles;
    } else {
      return [];
    }
  },
};

// Vuex Store
export default {
  persisted: 'indexeddb',
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
