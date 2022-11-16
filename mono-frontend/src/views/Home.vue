<template>
  <v-card flat class="mb-12">
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
          <InstitutionDropdown @change="onChangeInstitution" />
        </v-col>
      </v-row>
    </v-card-title>
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      color="primary"
    ></v-progress-linear>
    <v-row class="mx-2 mt-2">
      <v-col cols="6"><h2>Departures</h2></v-col>
    </v-row>
    <v-data-table
      :items-per-page="itemsPerPage"
      dense
      :headers="DEPARTURE_HEADERS"
      :items="departures"
      item-key="cdcrNumber"
      class="elevation-1 mx-4 mb-4 pa-4"
      :search="departureSearch"
      @keypress="filterTransfers"
      :loading-text="LOADING_TEXT"
      :no-data-text="
        selectedInstitution && selectedInstitution.institutionName
          ? 'No Pending Departures'
          : NO_INST_SEL_TEXT
      "
      no-results-text="No Departing Offender Data Found"
    >
      <template v-slot:top>
        <v-row>
          <v-col cols="4">
            <v-text-field
              dense
              v-model="departureSearch"
              label="Search Departing Offender Information"
              class="mx-4"
              prepend-inner-icon="mdi-magnify"
              clearable
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </template>
      <template v-slot:item.cdcrNumber="{ item }">
        <router-link
          :to="{
            name: 'Transfer Details',
            params: { cdcrNumber: item.cdcrNumber },
          }"
          @click.native="updateSelected(item)"
        >
          {{ item.cdcrNumber }}
        </router-link>
      </template>
      <template v-slot:item.fullName="{ item }">
        <span>{{ item.firstName }} {{ item.lastName }}</span>
      </template>
      <template v-slot:item.schedule="{ item }">
        <router-link to="">{{ item.schedule }}</router-link>
      </template>
      <template v-slot:item.print135="{ item }">
        <v-icon color="primary" class="ml-5" @click="create135(item, [item])">
          mdi-file-document
        </v-icon>
      </template>
    </v-data-table>
    <v-row class="mx-2">
      <v-col cols="12"><h2>Arrivals</h2></v-col>
    </v-row>
    <v-data-table
      :items-per-page="itemsPerPage"
      dense
      :headers="ARRIVAL_HEADERS"
      :items="arrivals"
      item-key="cdcrNumber"
      class="elevation-1 mx-4 mb-4 pa-4"
      :search="arrivalSearch"
      @keypress="filterOffenderArrivals"
      :no-data-text="
        selectedInstitution && selectedInstitution.institutionName
          ? 'No Pending Arrivals'
          : NO_INST_SEL_TEXT
      "
      no-results-text="No Arriving Offender Data Found"
    >
      <template v-slot:top>
        <v-row>
          <v-col cols="4">
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
          <v-spacer></v-spacer>
        </v-row>
      </template>
      <template v-slot:item.fullName="{ item }">
        <span>{{ item.firstName }} {{ item.lastName }}</span>
      </template>
      <template v-slot:item.origin="{ item }">
        <span>{{ getInstitutionByName(item.origin).institutionId }}</span>
      </template>
      <template v-slot:item.preprint135="{ item }">
        <v-icon color="primary" class="ml-5" @click="create135(item, [item])">
          mdi-file-document
        </v-icon>
      </template>
      <template v-slot:item.cdcrNumber="{ item }">
        <router-link
          :to="{
            name: 'Transfer Details',
            params: { cdcrNumber: item.cdcrNumber },
          }"
          @click.native="updateSelected(item)"
          >{{ item.cdcrNumber }}</router-link
        >
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import findAll from '@/helpers/findAll.js';
  import { get, call, sync } from 'vuex-pathify';
  import InstitutionDropdown from '@/components/util/InstitutionDropdown.vue';
  import departuresArrivalsSvc from '@/feathers/services/departuresarrivals/departuresarrivals.service.js';
  import pdfMake from 'pdfmake/build/pdfmake';
  import pdfFonts from 'pdfmake/build/vfs_fonts';
  import {
    DEPARTURE_HEADERS,
    ARRIVAL_HEADERS,
    DEPARTURES,
    ARRIVALS,
  } from '@/components/Home/constants.js';
  import { LOADING_TEXT, NO_INST_SEL_TEXT } from '@/helpers/tables.js';
  import create135 from '@/pdfs/create135.js';

  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  export default {
    name: 'Home',
    components: {
      InstitutionDropdown,
    },
    data: () => ({
      selDeparture: [],
      selArrival: [],
      itemsPerPage: 5,
      departureSearch: '',
      arrivalSearch: '',
      departures: [],
      arrivals: [],
      DEPARTURE_HEADERS,
      ARRIVAL_HEADERS,
      NO_INST_SEL_TEXT,
      LOADING_TEXT,
      DEPARTURES,
      ARRIVALS,
    }),
    async created() {
      await this.onChangeInstitution();
    },
    methods: {
      ...call('app', ['SET_SNACKBAR']),
      ...call('institutions', [
        'getInstitutionIdByOrigin',
        'getInstitutionByName',
      ]),
      create135,
      setSnackbar(msg, result, timeout) {
        this.SET_SNACKBAR({
          top: true,
          center: true,
          message: msg,
          color: result,
          timeout: timeout,
        });
      },
      // async getDepartures() {
      //   let filter = {
      //     query: {
      //       $sort: {
      //         transferDate: 1,
      //       },
      //     },
      //   };

      //   if (this.selectedInstitution) {
      //     filter.query.origin = this.selectedInstitution.institutionName;
      //   }
      //   try {
      //     const response = await findAll(departuresArrivalsSvc, filter);
      //     this.departures = response.data;
      //     // console.log('getDepartures(): departures => ', this.departures);
      //     if (!response) {
      //       alert(
      //         'No Transfers found for institution: ',
      //         this.selectedInstitution
      //       );
      //       return;
      //     }
      //   } catch (ex) {
      //     console.error('getDepartures() exception: ', ex);
      //   }
      // },
      // async getArrivals() {
      //   let filter = {
      //     query: {
      //       $sort: {
      //         transferDate: 1,
      //       },
      //     },
      //   };

      //   if (this.selectedInstitution) {
      //     filter.query.destination = this.getInstitutionIdByOrigin(
      //       this.selectedInstitution.institutionName
      //     );
      //   }
      //   try {
      //     const response = await findAll(departuresArrivalsSvc, filter);
      //     // console.log('getArrivals(): response => ', response);
      //     this.arrivals = response.data;
      //     if (!response) {
      //       alert(
      //         'No Transfers found for institution: ',
      //         this.selectedInstitution
      //       );
      //       return;
      //     }
      //   } catch (ex) {
      //     console.error('getArrivals() exception: ', ex);
      //   }
      // },
      async getTransfers(option) {
        if (!this.selectedInstitution) {
          // pop up a message
          return;
        }
        // Find all messages greeater than yeesterday
        const DAY_MS = 24 * 60 * 60 * 1000;

        let filter = {
          query: {
            $sort: {
              transferDate: 1,
            },
            isScheduled: true,
            isTransferred: false,
            transferDate: {
              $gt: new Date().getTime() - DAY_MS,
            },
          },
        };

        if (option === DEPARTURES) {
          filter.query.origin = this.selectedInstitution.institutionName;
        } else if (option === ARRIVALS) {
          filter.query.destination = this.selectedInstitution.institutionId;
        }

        try {
          const response = await findAll(departuresArrivalsSvc, filter);
          if (response && response.data) {
            if (option === DEPARTURES) {
              this.departures = response.data;
            } else if (option === ARRIVALS) {
              this.arrivals = response.data;
            }
          } else {
            alert(
              'No Transfers found for institution: ',
              this.selectedInstitution
            );
            return;
          }
        } catch (ex) {
          console.error('getDeparturesArrivals() exception: ', ex);
        }
      },
      async onChangeInstitution() {
        if (!this.selectedInstitution) {
          this.departures = [];
          this.arrivals = [];
          return;
        }

        // TODO: Try catch
        this.loading = true;
        await this.getTransfers(DEPARTURES);
        await this.getTransfers(ARRIVALS);
        this.loading = false;
      },
      filterTransfers(value, search) {
        return (
          value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search) !== -1
        );
      },
      filterOffenderArrivals(value, search) {
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
          element.endorsedDate
            ? (element.endorsedDate = new Date(element.endorsedDate)
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
      updateSelected(selected) {
        this.selTransferReason = {
          reasonCode: selected.TransferReasonCode,
          reasonDesc: selected.TransferReasonDesc,
        };
        this.selSchedule = {
          origin: selected.origin,
          originId: selected.originId,
          destination: selected.destination,
          title: selected.title,
          vias: selected.vias,
          transferDate: selected.transferDate,
          seats: selected.seats,
        };
      },
    },
    computed: {
      ...sync('transfers', ['transfers', 'selTransferReason']),
      ...sync('schedules', ['schedules', 'selSchedule']),
      ...get('institutions', ['selectedInstitution', 'listOfInstitutions']),
      ...get('users', ['loggedInUser']),
      ...sync('app', ['loading']),
      appUserRoles() {
        return this.$store.get('users/getAppUserRoles');
      },
    },
  };
</script>

<style scoped>
  .selInstitution {
    background-color: white;
    border-radius: 5px;
  }
</style>
