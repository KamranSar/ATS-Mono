import { make } from 'vuex-pathify';
import endorsedOffenders from '@/feathers/services/offender/endorsed.service.js';
import findAll from '@cdcr/vue-frontend/feathers/helpers/findAll.js';

const getDefaultState = () => {
  return {
    // Update your default state here
    /**
     * TODO: Persist/cache the endorsements
     * Set a timestamp of the last time it was pulled from SOMS
     * Ability to cache multiple institutions
     */
    endorsements: [],
  };
};
const state = getDefaultState();
const mutations = {
  ...make.mutations(state),
  resetState(state) {
    Object.assign(state, getDefaultState());
    // Define your reset state here
  },
};
const actions = {
  ...make.actions(state),
  // eslint-disable-next-line no-unused-vars
  init: async ({ dispatch }) => {
    // Define your init state here
  },
  getEndorsements: async (
    { state, rootState, dispatch },
    selectedInstitution
  ) => {
    console.log('selectedInstitution: ', selectedInstitution);
    let filter = {
      query: {
        $limit: 200,
        // $sort: {
        //   endorsedDate: 1,
        // },
      },
    };

    if (
      selectedInstitution &&
      selectedInstitution.institutionPartyId &&
      selectedInstitution.institutionName
    ) {
      filter.query.institutionId = selectedInstitution.institutionPartyId;
      filter.query.endorsedInstitution = {
        $ne: selectedInstitution.institutionName,
      };
    } else {
      state.endorsements = [];
      return;
    }
    try {
      rootState.app.loading = true;
      // const response = await endorsedOffenders.find(filter);
      const response = await findAll(endorsedOffenders, filter);
      if (response && response.data) {
        state.endorsements = response.data;
      } else {
        await dispatch(
          'app/SET_SNACKBAR',
          {
            top: true,
            center: true,
            message: `No Endorsements found for institution: ${selectedInstitution}`,
            type: 'info',
            timeout: 3000,
          },
          { root: true }
        );
        return;
      }
    } catch (ex) {
      await dispatch(
        'app/SET_SNACKBAR',
        {
          top: true,
          center: true,
          message: `ERROR! Problem fetching endorsements. Refresh and try again.`,
          type: 'error',
          timeout: 3000,
        },
        { root: true }
      );
      console.error(ex);
    } finally {
      rootState.app.loading = false;
    }
  },
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
