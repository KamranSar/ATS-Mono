import svcSchedules from '@/feathers/services/schedule/schedule.service.js';

const actions = {
  createSchedule: async ({ state, rootState }, scheduleObj) => {
    try {
      await svcSchedules.create(scheduleObj);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },

  init: async ({ dispatch }) => {
    await dispatch('readSchedules');
  },

  // readReason
  readSchedules: async ({ state, rootState }) => {
    try {
      rootState.app.loading = true;

      const response = await svcSchedules.find();
      state.reasons = response.data;
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },

  // readSchedule - by date
  readSchedulesByDate: async ({ state, rootState }, dateObj) => {
    try {
      rootState.app.loading = true;
      const filter = {
        query: {
          date: dateObj.date,
        },
      };
      state.schedules = await svcSchedules.find(filter);
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
      state.schedules = await svcSchedules.find(filter);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // updateSchedule
  updateSchedulesByDate: async ({ state, rootState }, scheduleObj) => {
    try {
      rootState.app.loading = true;

      await svcSchedules.update(scheduleObj._id, scheduleObj);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // deleteSchedule
  deleteSchedule: async ({ state, rootState }, id) => {
    try {
      rootState.app.loading = true;

      await svcSchedules.remove(id);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },

  // Add any more logic you require for your application below:
};

export default actions;
