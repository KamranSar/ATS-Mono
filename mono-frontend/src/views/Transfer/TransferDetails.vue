<template>
  <v-card flat class="mb-12" v-bind="$attrs">
    <TransferSearch />

    <!-- Progress Loader -->
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      color="primary"
    ></v-progress-linear>

    <v-card-text class="pa-2 mx-2" v-if="somsOffender">
      <!-- Transfer Header -->
      <TransferHeader class="mr-2" />

      <v-divider></v-divider>

      <!-- Transfer Panel -->
      <TransferPanel class="mr-2" />

      <!-- Holds Table -->
      <TransferHoldsTable class="mr-2" />
    </v-card-text>
  </v-card>
</template>

<script>
  import { get, call, sync } from 'vuex-pathify';
  import TransferSearch from '@/components/Transfer/TransferSearch.vue';
  import TransferHeader from '@/components/Transfer/TransferHeader.vue';
  import TransferPanel from '@/components/Transfer/TransferPanel.vue';
  import TransferHoldsTable from '@/components/Transfer/TransferHoldsTable.vue';
  // import transferModel from '@/models/transferModel.js';
  // import { setSnackbar } from '@cdcr/vue-frontend/helpers/snackbar.js';

  export default {
    name: 'TransferDetails',
    props: {
      cdcrNumber: {
        type: String,
        default: 'new',
      },
    },
    components: {
      TransferHeader,
      TransferSearch,
      TransferPanel,
      TransferHoldsTable,
    },
    data: () => ({}),
    async created() {
      try {
        this.selTransferReason = {
          reasonCode: this.transferData.transferReasonCode,
          reasonDesc: this.transferData.transferReasonDesc,
        };
      } catch (ex) {
        console.log(
          'TransferDetails.vue:created():readTransfers() exception => ',
          ex
        );
      }
    },
    computed: {
      ...sync('transfers', ['transferData', 'selTransferReason']),
      ...sync('schedules', ['selSchedule']),
      ...get('app', ['loading']),
      ...get('institutions', ['listOfInstitutions', 'getInstitutionByName']),
      // ...get('schedules', ['selSchedule']),
      ...get('transfers', ['somsOffender']),
    },
    methods: {
      ...call('app', ['SET_ALERT', 'SET_SNACKBAR']),
      ...call('transfers', ['readOffenderDetails', 'readTransfers']),
      ...call('schedules', ['readSchedules']),
      setSnackbar(msg, result, timeout) {
        this.SET_SNACKBAR({
          top: true,
          center: true,
          message: msg,
          color: result,
          timeout: timeout,
        });
      },
    },
  };
</script>
