import { make } from 'vuex-pathify';
import logout from '@cdcr/vue-frontend/helpers/logout.js';

/**
 * * NOTE: Device Preferences are saved per device in localStorage by default.
 */
const devicePrefs = {
  leftDrawOpen: false,
  rightDrawOpen: false,
  miniDraw: true,
  darkMode: false,
  tosAgreed: false,
  tosDialog: false,
};
const getDefaultState = () => {
  return {
    ...devicePrefs,
  };
};
const state = getDefaultState();
const mutations = {
  ...make.mutations(state),

  resetState(state) {
    // Maintain dark mode state when resetting
    let darkModeState = state.darkMode;

    Object.assign(state, getDefaultState());

    // Maintain dark mode state when resetting
    state.darkMode = darkModeState;
  },
};

const getters = {
  ...make.getters(state),
};

// Used to resolve the promise during onLogin
let resolveTOS = null;
const actions = {
  ...make.actions(state),

  popupTOS({ state }) {
    state.tosDialog = true;
    return new Promise(function (resolve) {
      resolveTOS = resolve;
    });
  },
  agree({ state }) {
    state.tosAgreed = true;
    state.tosDialog = false;
    if (resolveTOS) {
      resolveTOS(true);
    }
  },
  async disagree({ state }) {
    state.tosAgreed = false;
    state.tosDialog = false;

    await logout();
    if (resolveTOS) {
      resolveTOS(false);
    }
  },

  // eslint-disable-next-line no-unused-vars
  init: async ({ dispatch }) => {
    //
  },
};

export default {
  persisted: 'localStorage',
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
