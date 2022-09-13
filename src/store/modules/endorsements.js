import { make } from 'vuex-pathify';
import endorsedOffenders from '@/feathers/services/offender/endorsed.service.js';
import findAll from '@cdcr/vue-frontend/feathers/helpers/findAll.js';
import { _formatCaseFactors } from '@/components/Endorsements/constants.js';
import store from '@/store/';

function mapData(item) {
  // different named endorsed_offender fields mapped to transferModel() fields
  let mappedData = item;
  mappedData.offenderId = item.offenderId;
  mappedData.institutionId = store.getters['institutions/getInstitutionByName'](
    item.institutionName
  ).institutionId;
  mappedData.institutionPartyId = item.institutionId;
  mappedData.housing = item.housingArea;
  mappedData.caseFactor = _formatCaseFactors(item);
  mappedData.currentEndorsementDate = item.endorsedDate;
  mappedData.originalEndorsementDate = item.signedDate;
  mappedData.expirationEndorsementDate = item.expirationDate;
  mappedData.endorsedToName = item.endorsedInstitution;
  let ei = store.getters['institutions/getInstitutionByName'](
    item.institutionName
  );
  mappedData.endorsedToId = ei.institutionId;
  mappedData.endorsedToPartyId = ei.endorsedToPartyId;
  mappedData.endorsedSecurityLevel = item.endorsedSecurityLevel;
  return mappedData;
}

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
    let filter = {
      query: {
        $limit: 200,
      },
    };

    if (
      selectedInstitution &&
      selectedInstitution.institutionPartyId &&
      selectedInstitution.institutionName
    ) {
      // TODO - This needs to be fixed in the API by Mike Kirkland
      // institutionId should be the institution ACRONYM not the number id.
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
        const mappedData = response.data.map(mapData);
        console.log('maData(): mappedData => ', mappedData);
        // state.endorsements = response.data;
        state.endorsements = mappedData;
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
