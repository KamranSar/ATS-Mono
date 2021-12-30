<template>
  <v-card elevation="3" class="ma-4 px-4 pb-8" v-bind="$attrs">
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
    async created() {
      if (this.$route && this.$route.params && this.$route.params.cdcrNumber) {
        this.somsCDCRNumber = this.$route.params.cdcrNumber;
        await this.readOffenderDetails(this.somsCDCRNumber);
      }
    },
    computed: {
      ...get('app', ['loading']),
      ...get('transfers', ['somsOffender']),
    },
    methods: {
      ...call('transfers', ['readOffenderDetails']),
    },
  };
</script>
