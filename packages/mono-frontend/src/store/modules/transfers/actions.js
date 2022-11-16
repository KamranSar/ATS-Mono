import svcTransfers from '@/feathers/services/transfer/transfer.service.js';
import somsOffender from '@/feathers/services/offender/details.service.js';
import findAll from '@/helpers/findAll.js';
import transferModel from '@/models/transferModel.js';
import transferReasonModel from '@/models/transferReasonModel.js';
import formatCaseFactors from '@/helpers/formatCaseFactors';

const actions = {
  async readOffenderDetails({ state, rootState, dispatch }, cdcrNumber) {
    rootState.app.loading = true;
    try {
      state.transferData = transferModel();
      state.selTransferReason = transferReasonModel();

      const query = {
        query: {
          cdcrNumber: cdcrNumber,
        },
      };

      const response = await somsOffender.find(query);
      if (response && response.data && response.data.length) {
        state.somsOffender = response.data[0];
        // Some fields don't match up entirely from SOMS to Transfers
        state.transferData = transferModel({
          ...state.somsOffender,
          comments: '', // Comments from SOMS should not end up in editable comments field. Only read only comments field.
          institutionPartyId: state.somsOffender.institutionId,
          housing: state.somsOffender.housingArea,
          currentEndorsementDate: state.somsOffender.endorsedDate,
          originalEndorsementDate: state.somsOffender.signedDate,
          expirationEndorsementDate: state.somsOffender.expirationDate,
          endorsedToName: state.somsOffender.endorsedInstitution,
          caseFactor: formatCaseFactors(state.somsOffender),
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
    if (rootState.schedules && rootState.schedules.selSchedule) {
      const selSchedule = rootState.schedules.selSchedule;
      if (selSchedule && selSchedule._id) {
        state.transferData.title = selSchedule.title;
        state.transferData.scheduleId = selSchedule._id;
        state.transferData.transferDate = selSchedule.transferDate;
        state.transferData.vias = selSchedule.vias;
        state.transferData.isScheduled = true;
      } else {
        state.transferData.isScheduled = false;
      }
    }

    try {
      let response = [];
      if (state.transferData._id) {
        response = await dispatch('updateTransfer', state.transferData);
      } else {
        response = await dispatch('createTransfer', state.transferData);
      }
      if (response) {
        state.transferData = response;
      }
      return response;
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
  readTransfers: async ({ state, rootState }, queryObj) => {
    try {
      rootState.app.loading = true;
      const { data } = await findAll(svcTransfers, queryObj);
      if (data && data.length) {
        for (let item of data) {
          item.transferReason = {
            reasonCode: item.transferReasonCode,
            reasonDesc: item.transferReasonDesc,
          };
        }
        state.selTransferReason = {
          reasonCode: data[0].transferReasonCode,
          reasonDesc: data[0].transferReasonDesc,
        };
      }
      return data.length ? data : [];
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
