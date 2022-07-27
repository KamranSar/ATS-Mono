// This example module wraps around a Feathers service
import service from '@/feathers/services/institution/institution.service.js';
import findAll from '@cdcr/vue-frontend/feathers/helpers/findAll.js';
// eslint-disable-next-line no-unused-vars
import { defaultAdminRole } from '@/config/myApp.js';
import { make } from 'vuex-pathify';
const getEmptyInstitution = () => {
  return {
    _notindb: true,
    institutionName: 'NF',
    institutionId: 'NF',
    institutionPartyId: 'NF',
  };
};

const getDefaultState = () => {
  return {
    selectedInstitution: null, // An object
    listOfInstitutions: [],
  };
};
const state = getDefaultState();
const mutations = {
  ...make.mutations(state),
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};
const actions = {
  ...make.actions(state),
  // eslint-disable-next-line no-unused-vars
  getInstitutions: async ({ state, rootState }) => {
    {
      try {
        rootState.loading = true;
        const queryObject = {
          query: {
            $sort: {
              institutionName: 1,
            },
          },
        };

        const institutions = await findAll(service, queryObject);
        state.listOfInstitutions = institutions.data;
      } catch (error) {
        console.error('getInstitutions: ', error);
        state.listOfInstitutions = [];
      } finally {
        rootState.loading = false;
      }
    }
  },

  // eslint-disable-next-line no-unused-vars
  init: async ({ dispatch, rootGetters }) => {
    if (rootGetters['users/isUserLoggedIn']) {
      await dispatch('getInstitutions');
    }
  },
};
const getters = {
  getInstitutionByName: (state) => (name) => {
    const result = state.listOfInstitutions.find(
      (inst) => name === inst.institutionName
    );
    if (!result) {
      return getEmptyInstitution();
    }
    return result;
  },
  getInstitutionById: (state) => (id) => {
    const result = state.listOfInstitutions.find(
      (inst) => id === inst.institutionId
    );
    if (!result) {
      return getEmptyInstitution();
    }
    return result;
  },
  getInstitutionByPartyId: (state) => (partyId) => {
    const result = state.listOfInstitutions.find(
      (inst) => partyId === inst.institutionPartyId
    );
    if (!result) {
      return getEmptyInstitution();
    }
    return result;
  },
  /**
   * @example
   * getInstitutionIdByOrigin(this.selSchedule.origin)
   *
   * @param {*} origin
   * @returns Returns the abbreviated institution id
   */
  getInstitutionIdByOrigin: (state) => (origin) => {
    if (!origin) {
      console.error('No origin passed into getter getInstitutionId');
      return getEmptyInstitution().institutionId;
    }

    for (let i of state.listOfInstitutions) {
      // console.log('getInstitutionIdByOrigin(): i => ', i);
      if (i.institutionName == origin) {
        return i.institutionId;
      }
    }

    return getEmptyInstitution().institutionId;
  },
};

// Vuex Store
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
