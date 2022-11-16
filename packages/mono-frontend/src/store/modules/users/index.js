import { make } from 'vuex-pathify';
import actionsFile from '@/store/modules/users/actions.js';
import mutationsFile from '@/store/modules/users/mutations.js';
import getters from '@/store/modules/users/getters.js';

const getDefaultState = () => {
  return {
    loggedInUser: {}, // Required
  };
};

const state = getDefaultState();

const mutations = {
  ...make.mutations(state),
  ...mutationsFile,
};

const actions = {
  ...make.actions(state),
  ...actionsFile,
};

export default {
  persisted: 'indexedDB',
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export { getDefaultState };
