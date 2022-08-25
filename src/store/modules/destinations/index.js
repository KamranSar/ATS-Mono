import { make } from 'vuex-pathify';
import actionsFile from '@/store/modules/destinations/actions.js';
import mutationsFile from '@/store/modules/destinations/mutations.js';
import getters from '@/store/modules/destinations/getters.js';

const defaultDestination = {
  _id: '',
  institutionId: '',
  institutionName: '',
  institutionPartyId: '',
};

/**
 * Not all preferences are togglable, just show the ones that are.
 */
const getDefaultState = () => {
  return {
    destinations: [],
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

export { defaultDestination, getDefaultState };
