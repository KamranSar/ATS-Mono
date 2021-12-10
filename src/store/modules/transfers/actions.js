import svcTransfer from '@/feathers/services/transfer/transfer.service.js';

const actions = {
  // createSchedule: async ({ state, rootState }) => {
  //   try {
  //     await scheduleService.patch(loggedInUserPrefs._id, loggedInUserPrefs);
  //   } catch (error) {
  //     return error;
  //   } finally {
  //     rootState.app.loading = false;
  //   }
  // },

  // readSchedule - by date
  readTransfersByDate: async ({ state, rootState }, dateObj) => {
    try {
      rootState.app.loading = true;
      const filter = {
        query: {
          date: dateObj.date,
        },
      };
      state.transfers = await svcTransfer.find(filter);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // readSchedule - by institution
  readTransfersByInstitution: async ({ state, rootState }, institution) => {
    try {
      rootState.app.loading = true;
      const filter = {
        query: {
          institution: institution,
        },
      };
      state.schedules = await svcTransfer.find(filter);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // updateSchedule
  updateSchedulesByDate: async ({ state, rootState }, dateObj) => {
    try {
      rootState.app.loading = true;
      const filter = {
        query: {
          date: dateObj.date,
        },
      };
      state.schedules = await svcTransfer.patch(filter);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // deleteSchedule
  deleteSchedule: async ({ state, rootState }, name) => {
    try {
      rootState.app.loading = true;
      const filter = {
        query: {
          name: name,
        },
      };
      state.schedules = await svcTransfer.delete(filter);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },

  // Add any more logic you require for your application below:
};

export default actions;
