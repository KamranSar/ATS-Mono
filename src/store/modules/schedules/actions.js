import svcSchedules from '@/feathers/services/schedule/schedule.service.js';
import findAll from '@/feathers/helpers/findAll.js';

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
      const response = await findAll(svcSchedules);
      state.schedules = response.data;
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
          date: dateObj,
        },
      };
      state.schedules = await findAll(svcSchedules, filter);
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
      console.log(institution);
      console.log(dateObj);
      const filter = {
        query: {
          origin: institution,
          date: dateObj,
        },
      };
      const response = await findAll(svcSchedules, filter);
      state.schedules = response.data;
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // updateSchedule
  updateSchedule: async ({ state, rootState }, scheduleObj) => {
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
