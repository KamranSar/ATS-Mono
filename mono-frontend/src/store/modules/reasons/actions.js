import svcReasons from '@/feathers/services/reasons/reasons.service.js';
import findAll from '@/helpers/findAll.js';

const actions = {
  createReason: async ({ rootState }, reasonObj) => {
    try {
      const response = await svcReasons.create(reasonObj);
      return response;
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },

  init: async ({ dispatch, rootGetters }) => {
    if (rootGetters['users/isUserLoggedIn']) {
      await dispatch('readReasons');
    }
  },

  // readReason
  readReasons: async ({ state, rootState }, queryObj) => {
    try {
      rootState.app.loading = true;
      if (!queryObj) {
        queryObj = {
          query: {
            $sort: { reasonCode: 1 },
          },
        };
      }
      // const response = await svcReasons.find({
      const response = await findAll(svcReasons, queryObj);
      state.reasons = response.data;
      return response && response.data ? response.data : [];
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // updateReason
  updateReason: async ({ rootState }, reasonObj) => {
    try {
      rootState.app.loading = true;
      const response = await svcReasons.patch(reasonObj._id, reasonObj);
      return response;
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // deleteReason
  deleteReason: async ({ rootState }, id) => {
    try {
      rootState.app.loading = true;
      await svcReasons.remove(id);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },

  // Add any more logic you require for your application below:
};

export default actions;
