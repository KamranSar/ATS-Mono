<template>
  <v-card flat class="mb-12">
    <!-- TODO: This card title is also duplicated everywhere... turn into component? -->
    <v-card-title class="blue-grey lighten-4">
      <v-row>
        <v-col cols="4" xs="12" md="4" class="py-1" align-self="center">
          <h2>Endorsements</h2>
        </v-col>
        <v-col
          cols="4"
          xs="12"
          md="4"
          class="py-1 selInstitution"
          align-self="center"
        >
          <InstitutionDropdown @change="getEndorsements(selectedInstitution)" />
        </v-col>
        <v-col align="right" align-self="center">
          <BackToHome />
        </v-col>
      </v-row>
    </v-card-title>
    <v-data-table
      :search="endorsementSearch"
      :items-per-page="ENDORSEMENT_OPTIONS.itemsPerPage"
      dense
      :headers="ENDORSEMENT_HEADERS"
      :items="endorsements"
      item-key="cdcrNumber"
      class="elevation-1 ma-4 pa-4"
      :loading="loading"
      :options="ENDORSEMENT_OPTIONS"
      :loading-text="LOADING_TEXT"
      :no-data-text="NO_DATA_TEXT"
      :no-results-text="NO_RESULTS_TEXT"
      multi-sort
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

  export default {
    name: 'Endorsements',
    components: { BackToHome, InstitutionDropdown, DataTableItem },
    data: () => ({
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
      await this.getEndorsements(this.selectedInstitution);
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

        try {
          this.dlgRemarks = true;

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
      },
    },
    computed: {
      ...get('app', ['loading']),
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
