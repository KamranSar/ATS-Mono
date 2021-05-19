import { make } from 'vuex-pathify';

const getDefaultState = () => {
  return {
    user: {}, // Required
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

// Vuex Store
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
