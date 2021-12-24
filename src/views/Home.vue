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
  // import {departingOffenders, arrivingOffenders} from '@/assets/offenderData.js'
  // import DataService from '@/services/ats-services.js';
  import findAll from '@/feathers/helpers/findAll.js';
  import { get, sync, call } from 'vuex-pathify';

  export default {
    name: 'Dashboard',
    data: () => ({
      itemsPerPage: 5,
      loading: false,
      departureSearch: '',
      arrivalSearch: '',
      selectedInstitution: '',
      listOfInstitutions: [],
      // departingOffenders: departingOffenders,
      // arrivingOffenders: arrivingOffenders,
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
    async created() {
      if (
        this.loggedInUser &&
        this.loggedInUser.somsinfo &&
        this.loggedInUser.somsinfo.organizationName
      ) {
        this.selectedInstitution = this.loggedInUser.somsinfo.organizationName;
        console.log('0');
        const dt = Date.now();
        console.log(dt);
        await this.readSchedulesByOrigin(this.selectedInstitution, dt);
      }
    },
    async mounted() {
      await this.getInstitutions();
    },
    methods: {
      ...call('schedules', ['readSchedulesByOrigin']),

      async getInstitutions() {
        try {
          this.loading = true;
          const queryObject = {
            query: {
              $sort: {
                institutionName: 1,
              },
            },
          };

          // if (
          //   this.loggedInUser &&
          //   this.loggedInUser.appuserroles &&
          //   this.loggedInUser.appuserroles.roles.length &&
          //   !this.loggedInUser.appuserroles.roles.includes(defaultAdminRole.name)
          // ) {
          //   queryObject.query['institutionPartyId'] =
          //     this.loggedInUser.somsinfo.organizationId;
          // }

          const institutions = await findAll(
            '/api/eis/common/v1/institution',
            queryObject
          );

          this.listOfInstitutions = institutions.data;
          // this.selectedInstitution = !this.loggedInUser.somsinfo
          //   .organizationName
          //   ? null
          //   : this.loggedInUser.somsinfo.organizationName;
          return this.listOfInstitutions;
        } catch (error) {
          console.error('getInstitutions: ', error);
          this.listOfInstitutions = [];
          return [];
        } finally {
          this.loading = false;
        }
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
      ...sync('schedules', ['schedules']),
      ...get('users', ['loggedInUser']),

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
