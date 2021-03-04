import { make } from 'vuex-pathify';

const getDefaultState = () => {
  return {
    snack: {},
  };
};

const state = getDefaultState();

const mutations = {
  ...make.mutations(state),

  // ok, I am lazy!
  setSnack(state, showSnack) {
    state.snack = { ...showSnack };
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
