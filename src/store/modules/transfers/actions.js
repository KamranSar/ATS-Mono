import myApp from '@/config/myApp.js';
import svcTransfer from '@/feathers/services/schedule/transfer.service.js';

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
  // readSchedule - by institution and date
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
  // readSchedule - by institution and date
  readSchedulesByInstitution: async (
    { state, rootState },
    institution,
    dateObj
  ) => {
    try {
      rootState.app.loading = true;
      const filter = {
        query: {
          institution: institution,
          date: dateObj.date,
        },
      };
      state.schedules = await scheduleService.find(filter);
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
      state.schedules = await scheduleService.patch(filter);
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
      state.schedules = await scheduleService.delete(filter);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },

  // Add any more logic you require for your application below:
};

export default actions;
