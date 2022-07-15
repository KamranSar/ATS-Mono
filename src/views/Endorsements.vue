<template>
  <v-card flat class="mb-12">
    <!-- TODO: This card title is also duplicated everywhere... turn into component? -->
    <v-card-title class="blue-grey lighten-4">
      <v-row>
        <v-col cols="6" xs="12" md="4" class="py-1" align-self="center">
          <h2>
            Endorsements <font size="3" font-weight="100">(IN SOMS)</font>
          </h2>
        </v-col>
        <v-col
          cols="4"
          xs="12"
          md="4"
          class="py-1 selInstitution"
          align-self="center"
        >
          <InstitutionDropdown @change="_getEndorsements()" />
        </v-col>
        <v-col align="right" align-self="center">
          <BackToHome />
        </v-col>
      </v-row>
    </v-card-title>
    <v-progress-linear
      :loading="loading"
      :active="loading"
      :indeterminate="loading"
      absolute
      color="primary"
    ></v-progress-linear>
    <v-data-table
      v-if="endorsementsLoaded"
      :search="endorsementSearch"
      :items-per-page="ENDORSEMENT_OPTIONS.itemsPerPage"
      :headers="ENDORSEMENT_HEADERS"
      :items="endorsements"
      item-key="cdcrNumber"
      class="elevation-1 ma-4 pa-4"
      :options="ENDORSEMENT_OPTIONS"
      :loading-text="LOADING_TEXT"
      :no-data-text="NO_DATA_TEXT"
      :no-results-text="NO_RESULTS_TEXT"
      multi-sort
      dense
    >
      <!-- Endorsement Search -->
      <template v-slot:top>
        <v-row>
          <v-col cols="4">
            <v-text-field
              dense
              v-model="endorsementSearch"
              label="Search Endorsements"
              class="mx-4"
              prepend-inner-icon="mdi-magnify"
              clearable
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </template>
      <!-- Save ALL Endorsements -->
      <!-- <template v-slot:top>
        <v-row>
          <v-col cols="4">
            <v-btn class="secondary ma-2 btns" @click="saveAll()">
              SAVE ALL
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </template> -->

      <!-- Table columns -->
      <!-- FIXME: Sorting -->
      <template
        v-for="header in ENDORSEMENT_HEADERS"
        v-slot:[`item.${header.value}`]="{ item }"
      >
        <DataTableItem
          :header="header"
          :item="item"
          :key="header.value"
        ></DataTableItem>
      </template>

      <template v-slot:item.saved="{ item }">
        <v-icon>
          {{ item && item.saved ? 'mdi-check' : '' }}
        </v-icon>
      </template>
      <template v-slot:item.inHouseRemarks="{ item }">
        <v-btn :disabled="loading" icon @click.stop="openRemarks(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="dlgRemarks" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          In-House Remarks
        </v-card-title>
        <v-card-text>
          <v-textarea
            :disabled="loading"
            v-model="transferData.inHouseRemarks"
          />
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cancelRemarks()">CANCEL</v-btn>
          <v-btn color="primary" text @click="saveRemarks()">SAVE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import BackToHome from '@/components/util/BackToHome.vue';
  import InstitutionDropdown from '@/components/util/InstitutionDropdown.vue';
  import { get, call, sync } from 'vuex-pathify';
  import pdfMake from 'pdfmake/build/pdfmake';
  import pdfFonts from 'pdfmake/build/vfs_fonts';
  import transferModel from '@/models/transferModel';
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  import {
    ENDORSEMENT_HEADERS,
    ENDORSEMENT_OPTIONS,
    LOADING_TEXT,
    NO_DATA_TEXT,
    NO_RESULTS_TEXT,
  } from '@/components/Endorsements/constants.js';
  import scheduleModel from '@/models/scheduleModel';
  import DataTableItem from '@/components/util/DataTableItem.vue';
  import svcTransfers from '@/feathers/services/transfer/transfer.service.js';

  export default {
    name: 'Endorsements',
    components: { BackToHome, InstitutionDropdown, DataTableItem },
    data: () => ({
      endorsementsLoaded: false,
      dlgRemarks: false,
      endorsementSearch: '',
      ENDORSEMENT_HEADERS,
      ENDORSEMENT_OPTIONS,
      LOADING_TEXT,
      NO_DATA_TEXT,
      NO_RESULTS_TEXT,
      snackbarOptions: {
        top: true,
        center: true,
        message: '',
        color: '',
        timeout: 6000,
      },
    }),
    async mounted() {
      this.selSchedule = scheduleModel(); // Reset selected schedule when entering Endorsements page.
      // await this.getEndorsements(this.selectedInstitution);
      // await this.endorsementExists(this.endorsements);
      await this._getEndorsements();
      // await this.itemExists();
    },
    methods: {
      ...call('app', ['SET_SNACKBAR']),
      ...call('transfers', [
        'readTransfers',
        'readOffenderDetails',
        'saveForm',
      ]),
      ...call('endorsements', ['getEndorsements']),
      setSnackbar(msg, result, timeout) {
        this.SET_SNACKBAR({
          top: true,
          center: true,
          message: msg,
          color: result,
          timeout: timeout,
        });
      },
      async openRemarks(item) {
        if (!item) {
          this.setSnackbar(
            'ERROR ! Refresh the page and try again.',
            'error',
            3000
          );
          this.dlgRemarks = false;
          return;
        }
        this.dlgRemarks = true;

        await this.getOffender(item);
      },
      async getOffender(item) {
        try {
          let filter = {
            query: {
              cdcrNumber: item.cdcrNumber,
            },
          };
          let response = await this.readTransfers(filter);
          if (response && response.length > 0) {
            this.transferData = response[0];
          } else {
            await this.readOffenderDetails(item.cdcrNumber);
          }
        } catch (ex) {
          this.setSnackbar(
            'ERROR ! An error occurred attempting to get offender information.',
            'error',
            3000
          );
          console.error(ex);
        }
      },
      cancelRemarks() {
        this.dlgRemarks = false;
        this.transferData = transferModel();
      },
      async saveRemarks() {
        this.loading = true;
        try {
          let objIns = this.listOfInstitutions.find(
            (inst) =>
              this.transferData &&
              this.transferData.institutionName &&
              inst.institutionName === this.transferData.institutionName
          );
          if (objIns) {
            this.transferData.institutionName = objIns.institutionName;
            this.transferData.institutionId = objIns.institutionId;
            this.transferData.institutionPartyId = objIns.institutionPartyId;
          }
          objIns = this.listOfInstitutions.find(
            (inst) =>
              this.transferData &&
              this.transferData.endorsedToName &&
              inst.institutionName === this.transferData.endorsedToName
          );
          if (objIns) {
            this.transferData.endorsedToName = objIns.institutionName;
            this.transferData.endorsedToId = objIns.institutionId;
            this.transferData.endorsedToPartyId = objIns.institutionPartyId;
          }
          const response = await this.saveForm();

          if (response) {
            // setSnackbar successful
            const resp = this.endorsements.find(
              (end) => end.cdcrNumber === this.transferData.cdcrNumber
            );
            if (resp) {
              resp.saved = true;
            }

            this.setSnackbar('Successfully saved remarks!', 'succesful', 2000);
          } else {
            // setSnackbar error
            this.setSnackbar('Error saving remarks!', 'error', 6000);
          }
        } catch (ex) {
          // setSnackbar error
          console.error(ex);
          this.setSnackbar('Error occurred saving remarks!', 'error', 6000);
        }
        this.cancelRemarks();
        this.loading = false;
      },
      async _getEndorsements() {
        this.endorsementsLoaded = false;
        if (this.selectedInstitution) {
          await this.getEndorsements(this.selectedInstitution);
          console.log('getEndorsements() Finished.');

          this.loading = true;
          await this.endorsementExists();
          this.endorsementsLoaded = true;
          this.loading = false;
        }
      },
      async endorsementExists() {
        if (!this.endorsements) {
          return false;
        }

        const promiseArray = [];
        this.endorsements.forEach((element) => {
          try {
            let filter = {
              query: {
                $limit: 1,
                cdcrNumber: element.cdcrNumber,
              },
            };
            promiseArray.push(svcTransfers.find(filter));
          } catch (ex) {
            console.error(ex);
          }
        });

        const respArray = await Promise.all(promiseArray);

        respArray.forEach((response) => {
          if (response && response.total > 0) {
            // response.data[0].cdcrNumber;
            const resp = this.endorsements.find(
              (end) => end.cdcrNumber === response.data[0].cdcrNumber
            );
            if (resp) {
              resp.saved = true;
              console.log('resp: ', resp);
            }
          }
        });

        return true;
      },
      itemExists(item) {
        if (item && item.saved) {
          console.log(
            'Endorsements::itemExists(): item.cdcrNumber => ',
            item.cdcrNumber
          );
          console.log('Endorsements::itemExists(): item.saved => ', item.saved);
          return true;
        } else {
          return false;
        }
      },
    },
    computed: {
      ...sync('app', ['loading']),
      ...sync('transfers', ['transferData']),
      ...sync('schedules', ['selSchedule']),
      ...get('institutions', [
        'selectedInstitution',
        'listOfInstitutions',
        'getInstitutionByName',
      ]),
      ...get('endorsements', ['endorsements']),
    },
  };
</script>

<style scoped>
  .selInstitution {
    background-color: white;
    border-radius: 5px;
  }
  .nowrap {
    white-space: nowrap;
  }
</style>
