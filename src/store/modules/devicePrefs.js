import { make } from 'vuex-pathify';
/**
 * * NOTE: Device Preferences are saved per device in localStorage by default.
 */
const getDefaultState = () => {
  return {
    leftDrawOpen: false,
    rightDrawOpen: false,
    miniDraw: true,
    darkMode: false,
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

const actions = {
  ...make.actions(state),

  // eslint-disable-next-line no-unused-vars
  init: async ({ rootState, state, dispatch }) => {
    //
  },
};

const getters = {};

export default {
  persisted: 'localStorage',
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
