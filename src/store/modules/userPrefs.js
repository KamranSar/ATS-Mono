import Vue from 'vue';
import { make } from 'vuex-pathify';

const getDefaultState = () => {
  return {
    // TODO: May want to implement this per user id to support multiple user login prefs.
    leftDrawOpen: false,
    rightDrawOpen: false,
    darkMode: false, // Cannot persist userPrefs to localStorage because darkMode needs to be set on $vuetify
  };
};

const state = getDefaultState();

const mutations = {
  ...make.mutations(state),

  SET_DARK_MODE(state, value) {
    state.darkMode = value;
    Vue.prototype.$vuetify.framework.theme.dark = value;
  },

  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

const actions = {
  ...make.actions(state),
  // eslint-disable-next-line no-unused-vars
  init: async ({ dispatch }) => {
    //
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
