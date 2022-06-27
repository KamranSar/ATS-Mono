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
        <a class="text-decoration-none subtitle-2" @click="goBack">Back</a>
      </v-col>
    </v-row>
  </v-card-title>
</template>

<script>
  import { sync, call } from 'vuex-pathify';
  import scheduleModel from '@/models/scheduleModel.js';

  export default {
    name: 'TransferSearch',
    data: () => ({
      somsCDCRNumber: '',
    }),
    computed: {
      ...sync('app', ['loading']),
      ...sync('transfers', ['transferData', 'selTransferReason']),
      ...sync('schedules', ['selSchedule']),
    },
    methods: {
      ...call('app', ['SET_SNACKBAR']),
      ...call('transfers', ['readOffenderDetails', 'readTransfers']),
      ...call('schedules', ['readSchedules']),
      goBack() {
        this.$router.go(-1); // Will go back 1 step;
      },
      setSnackbar(msg, result, timeout) {
        this.SET_SNACKBAR({
          top: true,
          center: true,
          message: msg,
          color: result,
          timeout: timeout,
        });
      },
      async searchOffender() {
        await this.readOffenderDetails(this.somsCDCRNumber);
        const txResp = await this.readTransfers({
          query: {
            cdcrNumber: this.somsCDCRNumber,
          },
        });
        if (txResp && txResp.length) {
          this.transferData = txResp[0];
        }

        if (!this.transferData) {
          this.setSnackbar(
            `No record has been saved yet for cdcr number: ${this.somsCDCRNumber}`,
            'info',
            3000
          );
        } else if (this.transferData.cdcrNumber) {
          await this.readSchedules({
            query: { origin: this.transferData.institutionName },
          });

          if (this.schedules && !this.transferData.scheduleId) {
            this.selSchedule = this.schedules.find((item) => {
              if (item._id === this.transferData.scheduleId) {
                return item;
              } else {
                return scheduleModel();
              }
            });
          } else {
            this.selSchedule = scheduleModel();
          }
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
    async created() {
      console.log('TransferSearch::created()');
      const {
        params: { cdcrNumber },
      } = this.$route;
      // if (
      //   (cdcrNumber && !this.somsCDCRNumber) ||
      //   cdcrNumber !== this.somsCDCRNumber
      // ) {
      if (cdcrNumber && cdcrNumber !== this.somsCDCRNumber) {
        this.somsCDCRNumber = cdcrNumber;
        await this.searchOffender();
      }
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
