import { make } from 'vuex-pathify';
import actionsFile from '@/store/modules/transfers/actions.js';
import mutationsFile from '@/store/modules/transfers/mutations.js';
import getters from '@/store/modules/transfers/getters.js';
import transferModel from '@/models/transferModel.js';

/**
 * Not all preferences are togglable, just show the ones that are.
 */
const getDefaultState = () => {
  return {
    somsOffender: null, // The offender being viewed via /transfer/:cdcrNumber.
    transferData: transferModel(),
    selTransferReason: {
      // The selected reason in the TransferPanel
      reasonCode: '',
      reasonDesc: '',
    },
    showSOMSData: true,
    showHousing: false,
    showPhysical: false,
    showMedical: false,
    showPhoto: false,
    showComments: false,
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

export { getDefaultState };
