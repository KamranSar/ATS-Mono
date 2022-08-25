import svcDestinations from '@/feathers/services/destinations/destinations.service.js';
import findAll from '@cdcr/vue-frontend/feathers/helpers/findAll.js';

const actions = {
  createDestination: async ({ rootState }, destinationObj) => {
    try {
      const response = await svcDestinations.create(destinationObj);
      return response;
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },

  init: async ({ dispatch, rootGetters }) => {
    if (rootGetters['users/isUserLoggedIn']) {
      await dispatch('readDestinations');
    }
  },

  // readDestination
  readDestinations: async ({ state, rootState }, queryObj) => {
    try {
      rootState.app.loading = true;
      if (!queryObj) {
        queryObj = {
          query: {
            $sort: { institutionId: 1 },
          },
        };
      }
      // const response = await svcDestinations.find({
      const response = await findAll(svcDestinations, queryObj);
      state.destinations = response.data;
      return response && response.data ? response.data : [];
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // updateDestination
  updateDestination: async ({ rootState }, destinationObj) => {
    try {
      rootState.app.loading = true;
      const response = await svcDestinations.patch(
        destinationObj._id,
        destinationObj
      );
      return response;
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // deleteDestination
  deleteDestination: async ({ rootState }, id) => {
    try {
      rootState.app.loading = true;
      await svcDestinations.remove(id);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },

  // Add any more logic you require for your application below:
};

export default actions;
