import { make } from 'vuex-pathify';

const getDefaultState = () => {
  return {
    leftDrawEnabled: true,
    rightDrawEnabled: true,
    systemBarEnabled: true,
    footerEnabled: true,
    bottomBarEnabled: true,
  };
};

const state = getDefaultState();

const mutations = {
  ...make.mutations(state),

  setAlertMsg(state, alertMsg) {
    state.alert = { message: alertMsg };
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
