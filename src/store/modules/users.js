/* eslint-disable no-unused-vars */
import { make } from 'vuex-pathify';

const getDefaultState = () => {
  return {
    loggedInUser: {}, // Required
  };
};

const state = getDefaultState();

const mutations = {
  ...make.mutations(state),

  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

// https://docs.feathersjs.com/api/services.html#service-methods
const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
    //
  },
  find: async (context, params) => {},
  get: async (context, id, params) => {},
  create: async (context, data, params) => {},
  update: async (context, id, data, params) => {},
  patch: async (context, id, data, params) => {},
  remove: async (context, id, params) => {},
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
