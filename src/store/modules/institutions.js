// This example module wraps around a Feathers service
import service from '@/feathers/services/institution/institution.service.js';
import findAll from '@/feathers/helpers/findAll.js';
// eslint-disable-next-line no-unused-vars
import { defaultAdminRole } from '@/config/myApp.js';
import { make } from 'vuex-pathify';
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
  getInstitutions: async ({ state, rootState, rootGetters }) => {
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

        const loggedInUser = rootState.users.loggedInUser;
        const institutions = await findAll(service, queryObject);
        state.listOfInstitutions = institutions.data;

        if (
          loggedInUser &&
          loggedInUser.somsinfo &&
          loggedInUser.somsinfo.organizationName
        ) {
          // Grab entire institution object for the logged in user.
          state.selectedInstitution = state.listOfInstitutions.find(
            (inst) =>
              inst.institutionName === loggedInUser.somsinfo.organizationName
          );

          // FIXME: Remove Default of Avenal State Priston below...
          // Can't read schedules for an institution that DNE
          if (!state.selectedInstitution) {
            state.selectedInstitution = state.listOfInstitutions.find(
              (inst) => inst.institutionName === 'Avenal State Prison'
            );
          }
        }
      } catch (error) {
        console.error('getInstitutions: ', error);
        state.listOfInstitutions = [];
      } finally {
        rootState.loading = false;
      }
    }
  },

  // eslint-disable-next-line no-unused-vars
  init: async ({ dispatch }) => {
    //
    await dispatch('getInstitutions');
  },
};
// Vuex Store
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
