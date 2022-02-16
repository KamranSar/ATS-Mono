<template>
  <v-card-title class="blue-grey lighten-4">
    <v-row>
      <v-col cols="3" xs="12" md="3" class="py-1" align-self="center">
        <h2>Transfer</h2>
      </v-col>
      <v-col
        cols="4"
        xs="12"
        md="4"
        class="py-3 txtCDCRNumber"
        align-self="center"
      >
        <v-text-field
          class="pt-1 pb-0 ma-0"
          dense
          clearable
          autocomplete="off"
          label="Enter CDCR Number"
          type="text"
          @keypress.enter="searchOffender"
          @change="somsCDCRNumber = somsCDCRNumber.toUpperCase()"
          @keyup="somsCDCRNumber = somsCDCRNumber.toUpperCase()"
          v-model="somsCDCRNumber"
          hide-details
          background-color="white"
        >
        </v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn
          color="secondary"
          class="pa-5 ml-2 mt-1"
          @click="searchOffender()"
          :loading="loading"
        >
          <v-icon>mdi-magnify</v-icon>
          Search
        </v-btn>
      </v-col>
      <v-col cols="3" align="right" align-self="center">
        <v-icon small color="primary" right>mdi-arrow-left</v-icon>
        <a class="text-decoration-none subtitle-2" @click="goHome"
          >Back to Home</a
        >
      </v-col>
    </v-row>
  </v-card-title>
</template>

<script>
  import { sync, call } from 'vuex-pathify';
  import transferModel from '@/models/transferModel.js';

  export default {
    name: 'TransferSearch',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    data: () => ({}),
    computed: {
      ...sync('app', ['loading']),
      ...sync('transfers', ['transferData', 'selTransferReason']),
      ...sync('schedules', ['selSchedule']),
      somsCDCRNumber: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        },
      },
    },
    methods: {
      ...call('app', ['SET_SNACKBAR']),
      ...call('transfers', ['readOffenderDetails']),
      goHome() {
        this.$router.push({
          name: 'Home',
        });
      },
      async searchOffender() {
        this.transferData = transferModel();
        this.selSchedule = {};
        this.selTransferReason = {};
        await this.readOffenderDetails(this.somsCDCRNumber);
        if (this.transferData.cdcrNumber) {
          let cdcrNumber = this.transferData.cdcrNumber;
          this.$router.push({
            name: 'Transfer Details',
            params: {
              cdcrNumber,
            },
          });
        }
      },
    },
    watch: {},
  };
</script>

<style>
  .txtCDCRNumber {
    background-color: white;
    border-radius: 5px;
  }
</style>
