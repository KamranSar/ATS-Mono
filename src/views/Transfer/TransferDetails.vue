<template>
  <v-card flat class="mb-12" v-bind="$attrs">
    <TransferSearch v-model="somsCDCRNumber" />

    <!-- Progress Loader -->
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      color="primary"
    ></v-progress-linear>

    <v-divider></v-divider>

    <v-card-text class="pa-2 ma-0" v-if="somsOffender">
      <!-- Transfer Header -->
      <TransferHeader />

      <!-- Transfer Panel -->
      <TransferPanel />

      <!-- Holds Table -->
      <TransferHoldsTable />
    </v-card-text>
  </v-card>
</template>

<script>
  import { get, call } from 'vuex-pathify';
  import TransferSearch from '@/components/Transfer/TransferSearch.vue';
  import TransferHeader from '@/components/Transfer/TransferHeader.vue';
  import TransferPanel from '@/components/Transfer/TransferPanel.vue';
  import TransferHoldsTable from '@/components/Transfer/TransferHoldsTable.vue';
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
    data: () => ({
      somsCDCRNumber: '',
    }),
    // beforeDestroy() {
    //   this.selSchedule = [];
    //   this.selTransferReason = null;
    // },
    async created() {
      if (this.$route && this.$route.params && this.$route.params.cdcrNumber) {
        this.somsCDCRNumber = this.$route.params.cdcrNumber;
        await this.readOffenderDetails(this.somsCDCRNumber);

        await this.readSchedules({
          query: {
            origin:
              this.somsOffender && this.somsOffender.institutionName
                ? this.somsOffender.institutionName
                : '',
          },
        });

        const queryObj = {
          query: {
            cdcrNumber: this.somsCDCRNumber,
            schedule:
              this.selSchedule && this.selSchedule.length
                ? this.selSchedule[0].schedule
                : '',
          },
        };
        this.transferData = await this.readTransfers(queryObj);
      }
    },
    computed: {
      ...get('app', ['loading']),
      ...get('transfers', [
        'somsOffender',
        'transferData',
        'selTransferReason',
      ]),
      ...get('schedules', ['selSchedule']),
    },
    methods: {
      ...call('transfers', ['readOffenderDetails', 'readTransfers']),
      ...call('schedules', ['readSchedules']),
    },
  };
</script>
