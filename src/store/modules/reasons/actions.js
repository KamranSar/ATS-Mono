import svcReasons from '@/feathers/services/reasons/reasons.service.js';

const actions = {
  createReason: async ({ rootState }, reasonObj) => {
    try {
      await svcReasons.create(reasonObj);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },

  init: async ({ dispatch }) => {
    await dispatch('readReasons');
  },

  // readReason
  readReasons: async ({ state, rootState }) => {
    try {
      rootState.app.loading = true;
      const response = await svcReasons.find();
      state.reasons = response.data;
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
      await svcReasons.update(reasonObj._id, reasonObj);
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
