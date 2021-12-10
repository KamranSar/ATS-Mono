import svcReasons from '@/feathers/services/reason/reason.service.js';

const actions = {
  // createReason: async ({ state, rootState }) => {
  //   try {
  //     await scheduleService.patch(loggedInUserPrefs._id, loggedInUserPrefs);
  //   } catch (error) {
  //     return error;
  //   } finally {
  //     rootState.app.loading = false;
  //   }
  // },

  // readReason
  readReasons: async ({ state, rootState }) => {
    try {
      rootState.app.loading = true;
      // const filter = {
      //   query: {
      //     date: dateObj.date,
      //   },
      // };
      // ?      state.reasons = await svcReasons.find(filter);
      state.reasons = await svcReasons.find();
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // updateReason
  updateReasonsByDate: async ({ state, rootState }, dateObj) => {
    try {
      rootState.app.loading = true;
      const filter = {
        query: {
          date: dateObj.date,
        },
      };
      state.reasons = await svcReasons.patch(filter);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // deleteReason
  deleteReason: async ({ state, rootState }, name) => {
    try {
      rootState.app.loading = true;
      const filter = {
        query: {
          name: name,
        },
      };
      state.reasons = await svcReasons.delete(filter);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },

  // Add any more logic you require for your application below:
};

export default actions;
