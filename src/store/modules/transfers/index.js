import { make } from 'vuex-pathify';
import actionsFile from '@/store/modules/transfers/actions.js';
import mutationsFile from '@/store/modules/transfers/mutations.js';
import getters from '@/store/modules/transfers/getters.js';

const defaultTransfer = {
  _id: '',
  offenderId: '',
  cdcrNumber: '',
  firstName: '',
  lastName: '',
  currentEndorsementDate: null,
  originalEndorsementDate: null,
  expirationEndorsementDate: null,
  transferDate: null,
  schedule: '',
  transferReasonCode: '',
  transferReasonDesc: '',
  cdcr135Comments: '',
  inHouseRemarks: '',
  isTransferred: false,
  isScheduled: false,
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

export { defaultTransfer, getDefaultState };
