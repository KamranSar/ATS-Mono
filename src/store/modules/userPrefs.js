import { make } from 'vuex-pathify';

const getDefaultState = () => {
  return {
    leftDrawOpen: false,
    rightDrawOpen: false,
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
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
