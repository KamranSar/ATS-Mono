<template>
  <v-row>
    <v-col class="mt-0 pt-0">
      <v-data-table
        :items-per-page="itemsPerPage"
        dense
        :headers="holdsHeader"
        :items="holds"
        class="elevation-1"
        no-data-text="No Holds"
        no-results-text="No Holds Found"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title dense>Holds</v-toolbar-title>
          </v-toolbar>
          <v-divider class="pb-2"></v-divider>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
  import { get } from 'vuex-pathify';
  export default {
    name: 'TransferHoldsTable',
    data: () => ({
      itemsPerPage: 5,
      holdsHeader: [
        { text: 'Date', value: 'effectiveDate' },
        { text: 'Reason', value: 'holdType' },
        { text: 'Exp. Date', value: 'expirationDate' },
        { text: 'Comments', value: 'comments' },
      ],
    }),
    computed: {
      ...get('transfers', ['somsOffender']),
      holds() {
        return this.somsOffender.TransferHolds;
      },
    },
    methods: {},
  };
</script>
