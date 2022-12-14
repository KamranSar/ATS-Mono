import { make } from 'vuex-pathify';
import actionsFile from '@/store/modules/reasons/actions.js';
import mutationsFile from '@/store/modules/reasons/mutations.js';
import getters from '@/store/modules/reasons/getters.js';

const defaultReason = {
  _id: '',
  name: '',
  description: '',
};

/**
 * Not all preferences are togglable, just show the ones that are.
 */
const getDefaultState = () => {
  return {
    reasons: [],
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

export { defaultReason, getDefaultState };
