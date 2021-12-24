import svcTransfers from '@/feathers/services/transfer/transfer.service.js';
// import svcDA from '@/feathers/services/departuresarrivals/departuresarrivals.service.js';

const actions = {
  // eslint-disable-next-line no-unused-vars
  createTransfer: async ({ state, rootState }, transferObj) => {
    try {
      await svcTransfers.create(transferObj);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },

  init: async ({ dispatch }) => {
    await dispatch('readTransfers');
  },

  // readTransfers
  readTransfers: async ({ state, rootState }) => {
    try {
      rootState.app.loading = true;
      const response = await svcTransfers.find();
      state.transfers = response.data;
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // readTransfers By Date
  readTransfersByDate: async ({ state, rootState }, dateObj) => {
    try {
      rootState.app.loading = true;
      const filter = {
        query: {
          date: dateObj.date,
        },
      };
      state.transfers = await svcTransfers.find(filter);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // readTransfers By Institution
  readTransfersByInstitution: async ({ state, rootState }, institution) => {
    try {
      rootState.app.loading = true;
      const filter = {
        query: {
          institution: institution,
        },
      };
      state.transfers = await svcTransfers.find(filter);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // updateTransfers
  // eslint-disable-next-line no-unused-vars
  updateTransfer: async ({ state, rootState }, transferObj) => {
    try {
      rootState.app.loading = true;
      await svcTransfers.update(transferObj._id, transferObj);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // deleteTransfer
  // eslint-disable-next-line no-unused-vars
  deleteTransfer: async ({ state, rootState }, id) => {
    try {
      rootState.app.loading = true;
      await svcTransfers.remove(id);
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },

  // Add any more logic you require for your application below:
};

export default actions;
