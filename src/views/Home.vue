<template>
  <div class="ma-0 pa-0">
    <v-card class="mb-12">
      <v-card-title class="cardPrimary"> Institution Transfers </v-card-title>
      <v-row no-gutters>
        <v-col cols="6"><h2>Departures from Folsom State Prison</h2></v-col>
        <v-col cols="6" class="text-right">
          <v-btn x-large class="secondary" href="/transfer">
            New Offender Transfer
          </v-btn>
          <v-btn x-large class="secondary ml-2" href="/schedule">
            Go to Schedules
          </v-btn>
        </v-col>
      </v-row>
      <v-data-table
        :items-per-page="itemsPerPage"
        dense
        :headers="departingOffenderHeaders"
        :items="departingOffenders"
        item-key="cdcrNumber"
        class="elevation-1"
        :search="departureSearch"
        @keypress="filterTransfers"
        :loading="loading"
        loading-text="Syncing Data with SOMS... Please wait"
        no-data-text="No Pending Departures"
        no-results-text="No Departing Offender Data Found"
      >
        <template v-slot:top>
          <v-row>
            <v-col cols="5">
              <v-text-field
                dense
                v-model="departureSearch"
                label="Search Departing Offender Information"
                class="mx-4"
                prepend-inner-icon="mdi-magnify"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="7">
              <v-btn small class="secondary mt-2">
                <v-icon left>mdi-printer</v-icon>Print All Departing 135's
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <template v-slot:item.cdcrNumber="{ item }">
          <router-link to="">{{ item.cdcrNumber }}</router-link>
        </template>
        <template v-slot:item.fullName="{ item }">
          <span>{{ item.firstName }} {{ item.lastName }}</span>
        </template>
        <template v-slot:item.schedule="{ item }">
          <router-link to="">{{ item.schedule }}</router-link>
        </template>
        <template v-slot:item.print135="{ item }">
          <router-link to=""
            >{{ item.print135
            }}<v-icon color="primary" class="ml-5"
              >mdi-file-document</v-icon
            ></router-link
          >
        </template>
        <template v-slot:item.updates="{ item }">
          <v-icon color="green" class="ml-3" v-if="item.updates == true"
            >mdi-check-bold</v-icon
          >
        </template>

        <!-- <template
        v-slot:footer
      >
        <v-row>
          <v-col class="text-center mt-2">
<v-btn>Print all 135's</v-btn>
          </v-col>
        </v-row>
          
        
      </template> -->
      </v-data-table>
      <v-row class="my-4" no-gutters>
        <v-col cols="12"><h2>Arrivals to Folsom State Prison</h2></v-col>
      </v-row>
      <v-data-table
        :items-per-page="itemsPerPage"
        dense
        :headers="arrivingOffenderHeaders"
        :items="arrivingOffenders"
        item-key="cdcrNumber"
        class="elevation-1"
        :search="arrivalSearch"
        @keypress="filterOffenderArrivals"
        no-data-text="No Pending Arrivals"
        no-results-text="No Arriving Offender Data Found"
      >
        <template v-slot:top>
          <v-row>
            <v-col cols="5">
              <v-text-field
                dense
                v-model="arrivalSearch"
                label="Search Arriving Offender Information"
                class="mx-4"
                prepend-inner-icon="mdi-magnify"
                clearable
              >
              </v-text-field>
            </v-col>
            <v-col cols="7">
              <v-btn small class="secondary mt-2">
                <v-icon left>mdi-printer</v-icon>Print All Arriving 135's
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <template v-slot:item.fullName="{ item }">
          <span>{{ item.firstName }} {{ item.lastName }}</span>
        </template>
        <template v-slot:item.updates="{ item }">
          <v-icon class="ml-3" v-if="item.updates == true">
            mdi-check-bold
          </v-icon>
        </template>
        <template v-slot:item.cdcrNumber="{ item }">
          <router-link to="">{{ item.cdcrNumber }}</router-link>
        </template>
        <template v-slot:item.preprint135="{ item }">
          <router-link to="">
            {{ item.preprint135 }}
            <v-icon color="primary" class="ml-7"> mdi-file-document </v-icon>
          </router-link>
        </template>
      </v-data-table>
      <v-row>
        <v-col class="mt-4 text-center" cols="12">
          <span class="overline" style="width: 550px">
            <v-btn @click="syncSOMS" class="mr-2" icon>
              <v-icon x-large>mdi-sync</v-icon>
            </v-btn>
            Last SOMS Sync:
            <span class="primary--text font-weight-black">
              2021-05-05 1:22pm
            </span>
          </span>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
  // import {departingOffenders, arrivingOffenders} from '@/assets/offenderData.js'
  // import DataService from '@/services/ats-services.js';

  export default {
    name: 'Dashboard',
    data: () => ({
      itemsPerPage: 5,
      loading: false,
      departureSearch: '',
      arrivalSearch: '',
      // departingOffenders: departingOffenders,
      // arrivingOffenders: arrivingOffenders,
      departingOffenders: [],
      arrivingOffenders: [],
    }),
    methods: {
      syncSOMS() {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
        }, 3000);
      },
      // searchOffender(){
      //   console.log("I don't work yet :)")
      // },
      // eslint-disable-next-line no-unused-vars
      filterTransfers(value, search, item) {
        return (
          value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search) !== -1
        );
      },
      // eslint-disable-next-line no-unused-vars
      filterOffenderArrivals(value, search, item) {
        return (
          value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search) !== -1
        );
      },
      convertDepartingDates() {
        this.departingOffenders.forEach((element) => {
          element.endorseDate
            ? (element.endorseDate = new Date(element.endorseDate)
                .toISOString()
                .split('T')[0])
            : null;
        });
        this.departingOffenders.forEach((element) => {
          element.releaseDate
            ? (element.releaseDate = new Date(element.releaseDate)
                .toISOString()
                .split('T')[0])
            : null;
        });
      },
      convertArrivingDates() {
        this.arrivingOffenders.forEach((element) => {
          element.endorseDate
            ? (element.endorseDate = new Date(element.endorseDate)
                .toISOString()
                .split('T')[0])
            : null;
        });
        this.arrivingOffenders.forEach((element) => {
          element.releaseDate
            ? (element.releaseDate = new Date(element.releaseDate)
                .toISOString()
                .split('T')[0])
            : null;
        });
      },
    },
    computed: {
      departingOffenderHeaders() {
        return [
          {
            text: 'CDCR Number',
            align: 'start',
            value: 'cdcrNumber',
          },
          { text: 'Schedule', value: 'schedule' },
          { text: 'Name', value: 'fullName' },
          { text: 'Destination', value: 'program' },
          { text: 'VIAs', value: 'vias' },
          { text: 'Transfer Reason', value: 'transferReason' },
          { text: 'Endorsement Date', value: 'endorseDate' },
          { text: 'Release Date', value: 'releaseDate' },
          { text: 'Print 135', value: 'print135' },
          { text: 'Updates?', value: 'updates' },
        ];
      },
      arrivingOffenderHeaders() {
        return [
          {
            text: 'CDCR Number',
            align: 'start',
            value: 'cdcrNumber',
          },
          { text: 'Name', value: 'fullName' },
          { text: 'Transfer From', value: 'location' },
          { text: 'Transfer Reason', value: 'transferReason' },
          { text: 'Endorsement Date', value: 'endorseDate' },
          { text: 'Release Date', value: 'releaseDate' },
          { text: 'Pre-Print 135', value: 'preprint135' },
        ];
      },
    },
    //   created() {
    //     DataService.getDepartingOffenders()
    //       .then((response) => {
    //         this.departingOffenders = response.data.data;
    //         this.convertDepartingDates();
    //       })
    //       .then(() => {
    //         DataService.getArrivingOffenders().then((respsonse) => {
    //           this.arrivingOffenders = respsonse.data.data;
    //           this.convertArrivingDates();
    //         });
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //   },
  };
</script>

<style scoped></style>
