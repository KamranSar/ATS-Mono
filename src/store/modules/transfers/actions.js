import svcTransfers from '@/feathers/services/transfer/transfer.service.js';
import somsOffender from '@/feathers/services/offender/details.service.js';
import router from '@/router/';
// import svcDA from '@/feathers/services/departuresarrivals/departuresarrivals.service.js';

const actions = {
  async readOffenderDetails({ state, rootState, dispatch }, cdcrNumber) {
    rootState.app.loading = true;
    try {
      const query = {
        query: {
          cdcrnumber: cdcrNumber,
        },
      };

      console.log('readOffenderDetails(): query => ', query);
      const response = await somsOffender.find(query);
      console.log('readOffenderDetails(): response => ', response);

      if (response && response.data && response.data.length) {
        state.somsOffender = response.data[0];
        state.transferData.cdcrNumber = state.somsOffender.cdcrNumber;
        state.transferData.offenderId = state.somsOffender.offenderId;
        state.transferData.firstName = state.somsOffender.firstName;
        state.transferData.lastName = state.somsOffender.lastName;
        state.transferData.releaseDate = state.somsOffender.releaseDate;
        state.transferData.ethnicity = state.somsOffender.ethnicity;
        // state.transferData.caseFactor = state.somsOffender.caseFactor;
        state.transferData.housing = state.somsOffender.housingArea;
        state.transferData.securityLevel = state.somsOffender.securityLevel;
        state.transferData.tbCode = state.somsOffender.tbCode;
        state.transferData.currentEndorsementDate =
          state.somsOffender.endorseDate;
        state.transferData.originalEndorsementDate =
          state.somsOffender.dateEndorsementOriginal;
        state.transferData.comments = state.somsOffender.comments; // TODO Need to read from ATS db also
        state.transferData.inHouseRemarks = state.somsOffender.inHouseRemarks; // TODO Need to read from ATS db also

        console.log(
          'readOffenderDetails(): state.transferData => ',
          state.transferData
        );
        router.push({
          name: 'Transfer Details',
          params: {
            cdcrNumber,
          },
        });
      } else {
        dispatch(
          'app/SET_SNACKBAR',
          {
            bottom: true,
            center: true,
            message: 'No results found',
          },
          { root: true }
        );
        state.somsOffender = null;
      }
    } catch (error) {
      dispatch(
        'app/SET_SNACKBAR',
        {
          bottom: true,
          center: true,
          message: 'An error occurred, please try again later.',
        },
        { root: true }
      );
    } finally {
      rootState.app.loading = false;
    }
  },
  async saveForm({ state, rootState, dispatch }) {
    console.log('saveForm(): state => ', state);
    if (rootState.schedules && rootState.schedules.selSchedule[0]) {
      const schedules = rootState.schedules.schedules;
      const selSchedule = rootState.schedules.selSchedule[0];
      for (let schedule of schedules) {
        console.log('saveForm(): schedule => ', schedule);
        if (schedule.title == selSchedule.title) {
          state.transferData.title = schedule.title;
          state.transferData.scheduleId = schedule._id;
          state.transferData.transferDate = schedule.transferDate;
          // state.transferData.institution = schedule.origin;
          break;
        }
      }
    } else {
      console.log('saveForm(): rootState.schedules => ', rootState.schedules);
    }

    console.log('saveForm(): transferData => ', state.transferData);
    try {
      // if (state.transferData._id) {
      if (state.transferData._id) {
        await dispatch('updateTransfer', state.transferData);
        console.log('savForm(): Successfully updated Transfer!');
      } else {
        state.transferData.isScheduled = true;
        await dispatch('createTransfer', state.transferData);
        console.log('savForm(): Successfully created Transfer!');
      }
    } catch (ex) {
      console.error(ex);
    }
  },
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

  // eslint-disable-next-line no-unused-vars
  init: async ({ dispatch }) => {
    // await dispatch('readTransfers');
  },

  // readTransfers
  readTransfers: async ({ rootState }, queryObj) => {
    try {
      rootState.app.loading = true;
      const response = await svcTransfers.find(queryObj);
      console.log('readTransfers(): response => ', response);
      if (response && response.data) {
        for (let item of response.data) {
          item.transferReason = {
            reasonCode: item.transferReasonCode,
            reasonDesc: item.transferReasonDesc,
          };
        }
      }
      return response && response.data ? response.data : [];
    } catch (error) {
      console.error(error);
      return [];
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
      const response = await svcTransfers.find(filter);
      state.transfers = response.data;
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },
  // readTransfers By Date
  readTransfersBySchedule: async ({ state, rootState }, scheduleName) => {
    try {
      rootState.app.loading = true;
      const filter = {
        query: {
          name: scheduleName,
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
      console.log('updateTransfer(): transferObj => ', transferObj);
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
