import { make } from 'vuex-pathify';
import store from '@/store';

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
  setAlertMsg(state, alertMsg) {
    store.commit('alert/setAlertMsg', alertMsg);
  },
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
