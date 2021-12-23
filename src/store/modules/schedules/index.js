import { make } from 'vuex-pathify';
import actionsFile from '@/store/modules/schedules/actions.js';
import mutationsFile from '@/store/modules/schedules/mutations.js';
import getters from '@/store/modules/schedules/getters.js';

const defaultSchedule = {
  _id: '',
  origin: '',
  destination: '',
  schedule: '',
  vias: [],
  transferDate: null,
  seats: 0,
};

/**
 * Not all preferences are togglable, just show the ones that are.
 */
const getDefaultState = () => {
  return {
    schedules: [],
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
  // ! DO NOT SET `persisted`
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export { defaultSchedule, getDefaultState };
