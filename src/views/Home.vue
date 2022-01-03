<template>
  <!-- <v-card elevation="3" class="ma-4 px-4 pb-4">
    <v-card-title>
      <h2>Institution Transfers</h2>
    </v-card-title> -->
  <v-card class="mb-12">
    <v-card-title class="blue-grey lighten-4">
      <v-row>
        <v-col cols="4" xs="12" md="4" class="py-1" align-self="center">
          <h2>Home</h2>
        </v-col>
        <v-col
          cols="4"
          xs="12"
          md="4"
          class="py-1 selInstitution"
          align-self="center"
        >
          <v-autocomplete
            v-model="selectedInstitution"
            :disabled="loading"
            :items="listOfInstitutions"
            color="blue-grey lighten-2"
            label="Institution"
            item-text="institutionName"
            item-value="institutionName"
            return-object
            prepend-icon="mdi-bank"
            clearable
            hide-details="auto"
            class="ma-1 pa-1"
            autofocus
            background-color="white"
            @change="onChangeInstitution"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-card-title>
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      color="primary"
    ></v-progress-linear>
    <v-row no-gutters>
      <v-col cols="6"><h2>Departures</h2></v-col>
      <!-- FIXME remove <v-col cols="6" class="text-right">
          <v-btn x-large class="secondary" href="/transfer">
            New Offender Transfer
          </v-btn>
          <v-btn x-large class="secondary ml-2" href="/schedule">
            Go to Schedules
          </v-btn>
        </v-col> -->
    </v-row>
    <v-data-table
      :items-per-page="itemsPerPage"
      dense
      :headers="departureHeaders"
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
      <v-col cols="12"><h2>Arrivals</h2></v-col>
    </v-row>
    <v-data-table
      :items-per-page="itemsPerPage"
      dense
      :headers="arrivalHeaders"
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
  </v-card>
</template>

<script>
  import { get, sync, call } from 'vuex-pathify';
  // import departuresArrivalsSvc from '@/feathers/services/departuresarrivals/departuresarrivals.service.js';

  export default {
    name: 'Home',
    data: () => ({
      itemsPerPage: 5,
      loading: false,
      departureSearch: '',
      arrivalSearch: '',
      departingOffenders: [],
      arrivingOffenders: [],
      departureHeaders: [
        {
          text: 'CDCR Number',
          align: 'start',
          value: 'cdcrNumber',
        },
        { text: 'Schedule', value: 'schedule' },
        { text: 'Name', value: 'fullName' },
        { text: 'Destination', value: 'destination' },
        { text: 'VIAs', value: 'vias' },
        { text: 'Transfer Reason', value: 'transferReason' },
        { text: 'Endorsement Date', value: 'endorseDate' },
        { text: 'Release Date', value: 'releaseDate' },
        { text: 'Print 135', value: 'print135' },
        { text: 'Updates?', value: 'updates' },
      ],
      arrivalHeaders: [
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
      ],
    }),
    async mounted() {
      this.transfers = await this.readTransfers();
      // TODO: Get departures and arrivals by institition
      // const response = await departuresArrivalsSvc.find({
      //   query: {
      //     institution: this.selectedInstitution.institutionName,
      //   },
      // });
      // console.log('DEP ARR: ', response);
    },
    methods: {
      ...call('schedules', ['readSchedulesByOrigin']),
      ...call('transfers', ['readTransfersByInstitution']),

      /**
       * This method reads the schedule for the selected institution
       */
      async readTransfers() {
        await this.readTransfersByInstitution(
          this.selectedInstitution.institutionName
        );
        // For each transfer at the institution
        this.transfers.forEach((offender) => {
          // Find their schedule...
          const schedule = this.schedules.find(
            (sch) => sch.schedule === offender.schedule
          );

          if (schedule) {
            // Departing
            // An offender is departing from the institution
            // if the schedule he/she is assigned to has a different origin
            if (schedule.origin === this.selectedInstitution.institutionName) {
              this.departingOffenders.push(offender);
            }

            // Arrivals
            // An offender is arriving if the schedules destination
            // is the selected institution
            // if (
            //   schedule.destination === this.selectedInstitution.institutionId
            // ) {
            //   this.arrivingOffenders.push(offender);
            // }
          }
        });
      },

      // syncSOMS() {
      //   this.loading = true;
      //   setTimeout(() => {
      //     this.loading = false;
      //   }, 3000);
      // },
      onChangeInstitution() {},
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
      ...sync('transfers', ['transfers']),
      ...sync('schedules', ['schedules']),
      ...sync('institutions', ['selectedInstitution']),
      ...get('institutions', ['listOfInstitutions']),
      ...get('users', ['loggedInUser']),
      appUserRoles() {
        return this.$store.get('users/getAppUserRoles');
      },

      // departingOffenderHeaders() {
      //   return [
      //     {
      //       text: 'CDCR Number',
      //       align: 'start',
      //       value: 'cdcrNumber',
      //     },
      //     { text: 'Schedule', value: 'schedule' },
      //     { text: 'Name', value: 'fullName' },
      //     { text: 'Destination', value: 'program' },
      //     { text: 'VIAs', value: 'vias' },
      //     { text: 'Transfer Reason', value: 'transferReason' },
      //     { text: 'Endorsement Date', value: 'endorseDate' },
      //     { text: 'Release Date', value: 'releaseDate' },
      //     { text: 'Print 135', value: 'print135' },
      //     { text: 'Updates?', value: 'updates' },
      //   ];
      // },
      // arrivingOffenderHeaders() {
      //   return [
      //     {
      //       text: 'CDCR Number',
      //       align: 'start',
      //       value: 'cdcrNumber',
      //     },
      //     { text: 'Name', value: 'fullName' },
      //     { text: 'Transfer From', value: 'location' },
      //     { text: 'Transfer Reason', value: 'transferReason' },
      //     { text: 'Endorsement Date', value: 'endorseDate' },
      //     { text: 'Release Date', value: 'releaseDate' },
      //     { text: 'Pre-Print 135', value: 'preprint135' },
      //   ];
      // },
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

<style scoped>
  .selInstitution {
    background-color: white;
    border-radius: 5px;
  }
</style>
