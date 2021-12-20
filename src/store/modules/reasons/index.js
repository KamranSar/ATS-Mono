import { make } from 'vuex-pathify';
import actionsFile from '@/store/modules/reasons/actions.js';
import mutationsFile from '@/store/modules/reasons/mutations.js';
import getters from '@/store/modules/reasons/getters.js';

const defaultReason = {
  _id: '',
  name: '',
  description: '',
};

const DEFAULT_REASONS = [
  {
    name: 'ASU',
    description: 'Aggregation unit',
  },
  {
    name: 'BPTHRG',
    description: 'Board of prison Unit',
  },
  {
    name: 'BPTHRGRTN',
    description: 'Board of prison return unit',
  },
  {
    name: 'FAM',
    description: 'Family ties',
  },
  {
    name: 'FTTP',
    description: 'Foreign Transfer Treaty Program',
  },
  {
    name: 'GAIN',
    description: 'Gang Affiliation',
  },
  {
    name: 'ENE',
    description: 'Enemies',
  },
  {
    name: 'ENR',
    description: 'Enroute',
  },
  {
    name: 'HCPAR',
    description: 'Test',
  },
];
/**
 * Not all preferences are togglable, just show the ones that are.
 */
const getDefaultState = () => {
  return {
    reasons: [...DEFAULT_REASONS],
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
