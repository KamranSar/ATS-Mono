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
      :headers="ENDORSEMENT_HEADERS"
      :items="endorsements"
      item-key="cdcrNumber"
      :items-per-page="ENDORSEMENT_OPTIONS.itemsPerPage"
      class="elevation-1 ma-4 pa-4"
      :options="ENDORSEMENT_OPTIONS"
      :loading-text="LOADING_TEXT"
      :no-data-text="NO_DATA_TEXT"
      :no-results-text="NO_RESULTS_TEXT"
      multi-sort
      dense
    >
      <!--
      This will changed the dropdown options but ALL does not work
      :footer-props="{
        'items-per-page-options': [25, 100, 200, 'ALL'],
      }"
 -->
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
          <v-col cols="3">
            <v-row>
              <v-col cols="6">
                <v-btn
                  color="secondary"
                  class="mb-2"
                  dark
                  :disabled="loading"
                  @click="onSaveAll"
                >
                  <v-icon>mdi-content-save-outline</v-icon>
                  SAVE ALL
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  color="secondary"
                  class="mb-2"
                  dark
                  :disabled="loading"
                  @click="onClickRemove()"
                >
                  <v-icon>mdi-delete-forever</v-icon>
                  REMOVE ALL
                </v-btn>
              </v-col>
            </v-row>
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
      <template v-slot:item.actions="{ item }">
        <v-icon :disabled="loading" @click="openRemarks(item)"
          >mdi-pencil</v-icon
        >
        <v-icon :disabled="loading" @click="onClickRemove(item)"
          >mdi-delete-forever</v-icon
        >
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
          <v-btn color="primary" text @click="onSaveEndorsement()">SAVE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent v-model="dlgRemoveEndorsement" width="500">
      <v-card>
        <v-card-title class="blue-grey lighten-4">
          {{ dlgRemoveTitle }}
          <v-spacer />
          <v-btn small icon @click="dlgRemoveEndorsement = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          {{ dlgRemoveText }}
          <!-- <v-row no-gutters class="mt-2 caption">
            CDCR#: {{ cdcrNumber }}
          </v-row>
          <v-row no-gutters class="mt-2 caption">
            Name:
            {{
              selectedEndorsement.firstName + ' ' + selectedEndorsement.lastName
            }}
          </v-row> -->
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="onRemoveEndorsement()">
            Remove Endorsement
          </v-btn>
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
    SAVE_ALL_PLACEHOLDER,
  } from '@/components/Endorsements/constants.js';
  import scheduleModel from '@/models/scheduleModel';
  import DataTableItem from '@/components/util/DataTableItem.vue';
  import svcTransfers from '@/feathers/services/transfer/transfer.service.js';

  const DLG_REMOVE_TITLE = 'Remove Endorsement(s)';
  const DLG_REMOVE_TEXT =
    'Are you sure you want to remove this endorsement from ATS?';
  const DLG_REMOVE_ALL_TEXT =
    'Are you sure you want to remove ALL endorsements from ATS?';
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
      SAVE_ALL_PLACEHOLDER,
      snackbarOptions: {
        top: true,
        center: true,
        message: '',
        color: '',
        timeout: 6000,
      },
      dlgRemoveEndorsement: false,
      dlgRemoveTitle: DLG_REMOVE_TITLE,
      dlgRemoveText: DLG_REMOVE_TEXT,
    }),
    async mounted() {
      this.selSchedule = scheduleModel(); // Reset selected schedule when entering Endorsements page.
      await this._getEndorsements();
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
    methods: {
      ...call('app', ['SET_SNACKBAR']),
      ...call('transfers', [
        'readTransfers',
        'readOffenderDetails',
        'saveForm',
        'deleteTransfer',
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
            // response = await this.readOffenderDetails(item.cdcrNumber);
            this.transferData = item;
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
      async _getEndorsements() {
        this.endorsementsLoaded = false;
        if (this.selectedInstitution) {
          await this.getEndorsements(this.selectedInstitution);

          await this.endorsementExists();
          this.endorsementsLoaded = true;
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
              resp._id = response.data[0]._id;
            }
          }
        });

        return true;
      },
      async openRemarks(item) {
        if (this.loading) {
          return;
        }
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
      cancelRemarks() {
        this.dlgRemarks = false;
        this.transferData = transferModel();
      },
      async onSaveEndorsement() {
        this.loading = true;
        if (this.remarksPlaceholder) {
          this.saveAll();
        } else {
          this.saveEndorsement();
        }
        this.loading = false;
      },
      async saveEndorsement() {
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
          this.setSaveState(response, true);
        } catch (ex) {
          // setSnackbar error
          console.error(ex);
          this.setSnackbar('Error occurred saving remarks!', 'error', 3000);
        }
        this.cancelRemarks();
      },
      async onSaveAll() {
        this.remarksPlaceholder = this.SAVE_ALL_PLACEHOLDER;
        this.dlgRemarks = true;
      },
      async saveAll() {
        let remarks = '';
        if (this.transferData && this.transferData.inHouseRemarks) {
          remarks = this.transferData.inHouseRemarks;
        }
        for (const element of this.endorsements) {
          this.transferData = element;
          // if (!element.saved || element.saved === false) {
          this.transferData.inHouseRemarks = remarks;
          await this.saveEndorsement();
          // }
        }

        this.remarksPlaceholder = '';
        this.transferData = transferModel;
      },
      onClickRemove(item) {
        if (item) {
          this.transferData = item;
          this.dlgRemoveText = DLG_REMOVE_TEXT;
        } else {
          // Assume 'Remove All' button clicked
          this.dlgRemoveText = DLG_REMOVE_ALL_TEXT;
        }
        this.dlgRemoveEndorsement = true;
      },
      async onRemoveEndorsement() {
        this.loading = true;
        if (this.dlgRemoveText.includes('ALL')) {
          this.removeAll();
        } else {
          await this.removeEndorsement();
        }
        this.loading = false;
      },
      async removeEndorsement(_id) {
        const id = _id ? _id : this.transferData._id;
        try {
          const response = await this.deleteTransfer(id);
          this.setSaveState(response, false);
        } catch (ex) {
          console.error(ex);
          this.setSnackbar(`Failed to delete endorsement!`, 'error', 3000);
          return false;
        } finally {
          this.dlgRemoveEndorsement = false;
        }
      },
      async removeAll() {
        for (const element of this.endorsements) {
          if (element) {
            await this.removeEndorsement(element._id);
          }
        }

        this.transferData = transferModel();
      },
      setSaveState(response, save) {
        if (response) {
          let resp = this.endorsements.find(
            (end) => end.cdcrNumber === response.cdcrNumber
          );
          if (resp) {
            if (save) {
              resp.saved = true;
              resp._id = response._id;
              this.setSnackbar(
                'Successfully saved endorsement!',
                'successful',
                2000
              );
            } else {
              // resp.saved = false;
              // resp.inHouseRemarks = '';
              delete resp['saved'];
              delete resp['inHouseRemarks'];
              delete resp['_id'];
              this.setSnackbar(
                `Successfully removed endorsement!`,
                'successful',
                1500
              );
            }
          }
        } else {
          this.setSnackbar(
            `Unable to setSaveState. Refresh page to update data`,
            'warning',
            1500
          );
        }
      },
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
