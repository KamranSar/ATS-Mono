import svcSchedule from '@/feathers/services/schedule/schedule.service.js';

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
  readSchedulesByDate: async ({ state, rootState }, dateObj) => {
    try {
      rootState.app.loading = true;
      const filter = {
        query: {
          date: dateObj.date,
        },
      };
      state.schedules = await svcSchedule.find(filter);
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
      state.schedules = await svcSchedule.find(filter);
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
      state.schedules = await svcSchedule.patch(filter);
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
      state.schedules = await svcSchedule.delete(filter);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },

  // Add any more logic you require for your application below:
};

export default actions;
