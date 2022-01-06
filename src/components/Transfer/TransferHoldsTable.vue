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
  export default {
    name: 'TransferHoldsTable',
    data: () => ({
      // dlgDeleteHold: false,
      // dlgEditHold: false,
      itemsPerPage: 5,
      // editHoldTitle: '',
      // editedHoldIndex: -1,
      // editedHoldItem: {
      //   number: 0,
      //   reason: '',
      //   date: '',
      //   comments: '',
      // },
      // defaultHoldItem: {
      //   number: 0,
      //   reason: '',
      //   date: '',
      //   comments: '',
      // },
      // editedCaseFactorIndex: -1,
      // editedCaseFactorItem: {
      //   code: 0,
      // },
      // Holds Table Header
      holdsHeader: [
        // { text: 'Number', value: 'number' },
        { text: 'Date', value: 'effectiveDate' },
        { text: 'Reason', value: 'holdType' },
        { text: 'Exp. Date', value: 'expirationDate' },
        { text: 'Comments', value: 'comments' },
        // { text: 'Actions', value: 'actions', sortable: false },
      ],
      holds: [],
    }),
    computed: {
      // formTitleCF() {
      //   return this.editedCaseFactorIndex === -1
      //     ? 'New Case Factor'
      //     : 'Edit Case Factor';
      // },
      // formTitleHold() {
      //   return this.editedHoldIndex === -1 ? 'New Hold' : 'Edit Hold';
      // },
    },
    methods: {
      // Hold Methods
      // filterHolds() {},
      // cancelHold() {
      //   this.dlgEditHold = false;
      //   this.$nextTick(() => {
      //     this.editedHoldItem = Object.assign({}, this.defaultHoldItem);
      //     this.editedHoldIndex = -1;
      //   });
      // },
      // saveHold() {
      //   if (this.editedHoldIndex > -1) {
      //     Object.assign(this.holds[this.editedHoldIndex], this.editedHoldItem);
      //   } else {
      //     this.holds.push(this.editedHoldItem);
      //   }
      //   this.cancelHold();
      // },
      // deleteHoldItem(item) {
      //   this.editedHoldIndex = this.caseFactors.indexOf(item);
      //   this.editedHoldItem = Object.assign({}, item);
      //   this.dlgDeleteHold = true;
      // },
      // cancelDeleteHold() {
      //   this.dlgDeleteHold = false;
      //   this.$nextTick(() => {
      //     this.editedHoldItem = Object.assign({}, this.defaultHoldItem);
      //     this.editedHoldIndex = -1;
      //   });
      // },
      // confirmDeleteHold() {
      //   this.holds.splice(this.editedHoldIndex, 1);
      //   this.cancelDeleteCaseFactor();
      // },
      // cancelDeleteCaseFactor() {
      //   this.dlgDeleteCF = false;
      //   this.$nextTick(() => {
      //     this.editedCaseFactorItem = Object.assign({}, this.defaultItem);
      //     this.editedCaseFactorIndex = -1;
      //   });
      // },
      // editHoldItem(item) {
      //   this.editedHoldIndex = this.holds.indexOf(item);
      //   this.editedHoldItem = Object.assign({}, item);
      //   this.dlgEditHold = true;
      // },
    },
  };
</script>
