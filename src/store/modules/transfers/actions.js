import svcTransfers from '@/feathers/services/transfer/transfer.service.js';
import somsOffender from '@/feathers/services/offender/details.service.js';
import findAll from '@cdcr/vue-frontend/feathers/helpers/findAll.js';
// import router from '@/router/';
// import svcDA from '@/feathers/services/departuresarrivals/departuresarrivals.service.js';
import transferModel from '@/models/transferModel.js';
import scheduleModel from '@/models/scheduleModel.js';
import transferReasonModel from '@/models/transferReasonModel.js';

const actions = {
  async readOffenderDetails({ state, rootState, dispatch }, cdcrNumber) {
    rootState.app.loading = true;
    try {
      state.transferData = transferModel();
      rootState.schedules.selSchedule = scheduleModel();
      state.selTransferReason = transferReasonModel();

      const query = {
        query: {
          cdcrnumber: cdcrNumber,
        },
      };

      console.log('readOffenderDetails(): query => ', query);
      const response = await somsOffender.find(query);
      console.log('readOffenderDetails(): response => ', response);
      console.log(
        'readOffenderDetails(): transferData => ',
        state.transferData
      );
      if (response && response.data && response.data.length) {
        state.somsOffender = response.data[0];
        state.transferData.cdcrNumber = state.somsOffender.cdcrNumber;
        state.transferData.offenderId = state.somsOffender.offenderId;
        state.transferData.firstName = state.somsOffender.firstName;
        state.transferData.lastName = state.somsOffender.lastName;
        state.transferData.institutionName = state.somsOffender.institutionName;
        state.transferData.institutionPartyId =
          state.somsOffender.institutionId;
        state.transferData.releaseDate = state.somsOffender.releaseDate;
        state.transferData.ethnicity = state.somsOffender.ethnicity;
        // state.transferData.caseFactor = state.somsOffender.caseFactor;
        state.transferData.housing = state.somsOffender.housingArea;
        state.transferData.securityLevel = state.somsOffender.securityLevel;
        state.transferData.tbCode = state.somsOffender.tbCode;
        state.transferData.currentEndorsementDate =
          state.somsOffender.endorsedDate;
        state.transferData.originalEndorsementDate =
          state.somsOffender.signedDate;
        state.transferData.expirationEndorsementDate =
          state.somsOffender.expirationDate;
        state.transferData.endorsedToName =
          state.somsOffender.endorsedInstitution;

        // state.transferData.comments = state.somsOffender.comments; // TODO Need to read from ATS db also
        // state.transferData.inHouseRemarks = state.somsOffender.inHouseRemarks; // TODO Need to read from ATS db also

        console.log(
          'readOffenderDetails(): state.transferData => ',
          state.transferData
        );
        // router.push({
        //   name: 'Transfer Details',
        //   params: {
        //     cdcrNumber,
        //   },
        // });
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
      // FIXME: When searching for an offernder that DNE the api returns a SQL query error..
      dispatch(
        'app/SET_SNACKBAR',
        {
          bottom: true,
          center: true,
          message: 'No results found.',
        },
        { root: true }
      );
    } finally {
      rootState.app.loading = false;
    }
  },
  async saveForm({ state, rootState, dispatch }) {
    console.log('saveForm(): state => ', state);
    if (rootState.schedules && rootState.schedules.selSchedule) {
      const schedules = rootState.schedules.schedules;
      const selSchedule = rootState.schedules.selSchedule;
      for (let schedule of schedules) {
        console.log('saveForm(): schedule => ', schedule);
        if (schedule.title === selSchedule.title) {
          // FIXME Check to make sure fields are valid
          state.transferData.title = schedule.title;
          state.transferData.scheduleId = schedule._id;
          state.transferData.transferDate = schedule.transferDate;
          state.transferData.vias = schedule.vias;
          state.transferData.isScheduled = true;
          break;
        }
      }
    } else {
      console.log('saveForm(): rootState.schedules => ', rootState.schedules);
    }

    console.log('saveForm(): transferData => ', state.transferData);
    try {
      if (state.transferData._id) {
        return await dispatch('updateTransfer', state.transferData);
        // const response = await dispatch('updateTransfer', state.transferData);
        // return response;
      } else {
        return await dispatch('createTransfer', state.transferData);
        // const response = await dispatch('createTransfer', state.transferData);
        // return response;
      }
    } catch (ex) {
      console.error(ex);
    }
    return [];
  },
  // eslint-disable-next-line no-unused-vars
  createTransfer: async ({ state, rootState }, transferObj) => {
    try {
      const response = await svcTransfers.create(transferObj);
      return response;
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
      // const response = await svcTransfers.find(queryObj);
      const response = await findAll(svcTransfers, queryObj);
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
      // state.transfers = await svcTransfers.find(filter);
      state.transfers = await findAll(svcTransfers, filter);
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
      // const response = await svcTransfers.find(filter);
      const response = await findAll(svcTransfers, filter);
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
      // state.transfers = await svcTransfers.find(filter);
      state.transfers = await findAll(svcTransfers, filter);
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
      const response = await svcTransfers.patch(transferObj._id, transferObj);
      return response;
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
      const response = await svcTransfers.remove(id);
      return response;
    } catch (error) {
      return error;
    } finally {
      rootState.app.loading = false;
    }
  },

  // Add any more logic you require for your application below:
};

export default actions;
