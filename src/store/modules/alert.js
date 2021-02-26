import { make } from 'vuex-pathify';

const getDefaultState = () => {
  return {
    alert: {},
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
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
