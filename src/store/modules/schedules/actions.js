import svcSchedules from '@/feathers/services/schedule/schedule.service.js';
import findAll from '@cdcr/vue-frontend/feathers/helpers/findAll.js';

const actions = {
  // eslint-disable-next-line no-unused-vars
  createSchedule: async ({ state, rootState }, scheduleObj) => {
    try {
      await svcSchedules.create(scheduleObj);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },

  init: async () => {
    //
  },

  // readReason
  readSchedules: async ({ state, rootState }, queryObj) => {
    try {
      rootState.app.loading = true;
      const response = await findAll(svcSchedules, queryObj);
      state.schedules = response.data;
      return response && response.data ? response.data : [];
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
  readSchedulesByOrigin: async (
    { state, rootState },
    { institution, dateObj }
  ) => {
    try {
      rootState.app.loading = true;
      // console.log(institution);
      // console.log(dateObj);
      const filter = {
        query: {
          origin: institution,
        },
      };
      if (dateObj) {
        filter.query.transferDate = new Date(dateObj).setHours(0, 0, 0, 0);
      }
      // console.log(filter);
      const response = await findAll(svcSchedules, filter);
      state.schedules = response.data;
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  readSchedulesByDestination: async (
    { state, rootState },
    destination,
    dateObj
  ) => {
    try {
      rootState.app.loading = true;
      // console.log(dateObj);
      const filter = {
        query: {
          destination: destination,
        },
      };
      if (dateObj) {
        filter.query.transferDate = dateObj;
      }
      const response = await findAll(svcSchedules, filter);
      state.schedules = response.data;
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // updateSchedule
  // eslint-disable-next-line no-unused-vars
  updateSchedule: async ({ state, rootState }, scheduleObj) => {
    try {
      rootState.app.loading = true;

      await svcSchedules.patch(scheduleObj._id, scheduleObj);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // deleteSchedule
  // eslint-disable-next-line no-unused-vars
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
