import { make } from 'vuex-pathify';

const getDefaultState = () => {
  return {
    // TODO: May want to implement this per user id to support multiple user login prefs.
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
