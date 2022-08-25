<template>
  <v-card flat class="mb-12">
    <v-card-title class="blue-grey lighten-4">
      <v-row>
        <v-col cols="4" xs="12" md="4" class="py-1" align-self="center">
          <h2>Schedules</h2>
        </v-col>
        <v-col
          cols="4"
          xs="12"
          md="4"
          class="py-1 selInstitution"
          align-self="center"
        >
          <InstitutionDropdown
            :loading="loading"
            @change="onSelectedInstitution"
          />
        </v-col>
        <v-col align="right" align-self="center">
          <BackToHome />
        </v-col>
      </v-row>
    </v-card-title>
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      color="primary"
    ></v-progress-linear>
    <v-card flat class="ma-4">
      <!-- Data table will push to selectedSchedule -->
      <v-data-table
        v-model="selectedSchedule"
        :headers="headersSchedule"
        item-key="_id"
        :items="schedules"
        single-select
        show-select
        sort-by="scheduleId"
        class="elevation-1 pa-2 mt-2"
        @item-selected="onSelectedSchedule"
      >
        <template v-slot:top>
          <v-card-text
            class="py-0"
            flat
            color="white"
            v-show="enableEditing && hasInstitutionRole"
          >
            <v-row>
              <v-col xs="12" sm="12" md="3" lg="1" align-self="baseline">
                <v-text-field
                  label="Schedule"
                  v-model="editSchedule.title"
                ></v-text-field>
              </v-col>
              <v-col xs="12" sm="12" md="4" lg="2" align-self="baseline">
                <!-- 
                  Filtering out selectedInstitution from the list
                  Destination cannot be the origin.
                -->
                <v-combobox
                  label="Destination"
                  v-model="editSchedule.destination"
                  :items="listOfDestinations"
                  item-text="institutionName"
                  item-value="institutionId"
                  clearable
                >
                  <template v-slot:item="{ item }">
                    {{ item.institutionId }} --- {{ item.institutionName }}
                  </template>
                </v-combobox>
              </v-col>
              <v-col xs="12" sm="12" md="3" lg="1" align-self="baseline">
                <!-- 
                  Filtering out selectedInstitution from the list
                  Destination cannot be the origin.
                -->
                <v-select
                  label="Vias"
                  v-model="editSchedule.vias"
                  :items="listOfDestinations"
                  item-text="institutionId"
                  item-value="institutionId"
                  multiple
                  clearable
                ></v-select>
              </v-col>
              <v-col xs="12" sm="12" md="4" lg="2" align-self="start">
                <DatePicker
                  label="Transfer Date"
                  v-model="editSchedule.transferDate"
                  align="top"
                  pickerType="DATE"
                />
              </v-col>
              <v-col xs="12" sm="12" md="3" lg="1" align-self="baseline">
                <v-text-field
                  label="Seats"
                  v-model="editSchedule.seats"
                ></v-text-field>
              </v-col>
              <!-- <v-spacer></v-spacer> -->
              <v-col xs="12" sm="12" md="3" lg="1" align-self="center">
                <v-btn class="secondary ma-2 btns" @click="saveSchedule()">
                  <!-- {{ btnAddEditSchedule }} -->
                  SAVE
                </v-btn>
              </v-col>
              <!-- <v-col cols="1" sm="2" lg="1" align-self="center" align="right">
                <v-btn class="secondary ma-2 btns">Filter</v-btn>
              </v-col> -->
            </v-row>
          </v-card-text>
        </template>
        <template v-slot:item.print135="{ item }">
          <v-icon
            color="primary"
            class="ml-5"
            @click="print135BySchedule(item)"
          >
            mdi-file-document
          </v-icon>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="openSchedule(item)"
            v-show="enableEditing && hasInstitutionRole"
          >
            mdi-pencil
          </v-icon>

          <v-btn
            v-show="enableEditing && hasInstitutionRole"
            @click.stop="onDeleteSchedule(item)"
            icon
            small
          >
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </template>
        <template v-slot:no-data>
          <span>No Results</span>
        </template>
      </v-data-table>

      <v-card
        v-show="
          selectedSchedule && selectedSchedule[0] && selectedSchedule[0]._id
        "
        class="mt-2 pb-4"
      >
        <v-card-title class="blue-grey lighten-4">
          <v-row>
            <v-col cols="2" xs="12" sm="2" class="py-1" align-self="center">
              <span>Endorsements <font size="2">(IN ATS)</font></span>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-card-title>
        <v-data-table
          :headers="headersEndorsement"
          :items="endorsements"
          sort-by="lastName"
          flat
          class="ma-2"
        >
          <template v-slot:top>
            <v-card-text
              class="py-0 mt-4"
              flat
              color="white"
              v-show="enableEditing && hasInstitutionRole"
            >
              <v-row>
                <v-col xs="12" sm="12" md="3" lg="1" align-self="baseline">
                  <v-text-field
                    label="CDCR #"
                    v-model="editEndorsement.cdcrNumber"
                    @blur="getOffender"
                    @change="onChangeCDCRNumber"
                    @keyup="onChangeCDCRNumber"
                    clearable
                    @click:clear="onClearCDCRNumber"
                  ></v-text-field>
                </v-col>
                <v-col xs="12" sm="12" md="3" lg="1" align-self="baseline">
                  <v-text-field
                    label="Last Name"
                    v-model="editEndorsement.lastName"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col xs="12" sm="12" md="3" lg="1" align-self="baseline">
                  <v-text-field
                    label="First Name"
                    v-model="editEndorsement.firstName"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col xs="12" sm="12" md="3" lg="1" align-self="baseline">
                  <v-text-field
                    label="Housing"
                    v-model="editEndorsement.housing"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col xs="12" sm="12" md="4" lg="2" align-self="baseline">
                  <v-select
                    label="Specific Transfer Reason"
                    v-model="selTransferReason"
                    return-object
                    :items="reasons"
                    item-value="reasonCode"
                    item-text="reasonDesc"
                    class="mt-4 pl-1"
                    hide-details="true"
                    clearable
                    @change="transferReasonSelected"
                  >
                    <template v-slot:item="{ item, on, attrs }">
                      <v-list-item v-on="on" v-bind="attrs">
                        <v-list-item-content>
                          {{ item.reasonCode }} - {{ item.reasonDesc }}
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
                <v-col xs="12" sm="12" md="4" lg="2" align-self="baseline">
                  <v-text-field
                    label="Endorsement Date"
                    v-model="editEndorsement.currentEndorsementDate"
                    readonly
                  ></v-text-field>
                </v-col>
                <!-- <v-spacer></v-spacer> -->
                <v-col xs="12" sm="12" md="3" lg="1" align-self="center">
                  <v-btn
                    :disabled="disableSaveEndorsementButton"
                    class="secondary ma-2 btns"
                    @click="saveEndorsement()"
                  >
                    SAVE
                  </v-btn>
                </v-col>
                <v-col xs="12" sm="12" md="3" lg="2" align-self="center">
                  <v-checkbox
                    v-show="chkbxShowAllEndorsements"
                    label="Show ALL Endorsements"
                    v-model="showAllEndorsements"
                    @click="onShowAllEndorsements"
                  ></v-checkbox>
                </v-col>
                <!-- <v-col cols="1" sm="2" lg="1" align-self="center" align="right">
                <v-btn class="secondary ma-2 btns">Filter</v-btn>
              </v-col> -->
              </v-row>
            </v-card-text>
          </template>

          <template
            v-for="header in headersEndorsement"
            v-slot:[`item.${header.value}`]="{ item }"
          >
            <DataTableItem
              :header="header"
              :item="item"
              :key="header.value"
            ></DataTableItem>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="openEndorsement(item)"
              v-show="enableEditing && hasInstitutionRole"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="onDeleteEndorsement(item)"
              v-show="enableEditing && hasInstitutionRole"
              >mdi-delete</v-icon
            >
          </template>
          <template v-slot:item.print="{ item }">
            <v-icon
              color="primary"
              class="ml-5"
              @click="print135ByCdcrNumber(item)"
            >
              mdi-file-document
            </v-icon>
          </template>
          <template v-slot:no-data>
            <span>No Results</span>
          </template>
        </v-data-table>
        <!-- </div> -->
      </v-card>

      <v-dialog persistent v-model="dialogDeleteSchedule" width="500">
        <v-card>
          <v-card-title class="blue-grey lighten-4">
            {{ deleteDialogTitle }}
            <v-spacer />
            <v-btn small icon @click="dialogDeleteSchedule = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text>
            {{ deleteDialogText }}
            <v-row no-gutters class="mt-2 caption">
              Schedule: {{ selectedSchedule[0].title }}
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              text
              @click="onDeleteSchedule(selectedSchedule[0])"
            >
              Remove Schedule
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog persistent v-model="dialogDeleteEndorsement" width="500">
        <v-card>
          <v-card-title class="blue-grey lighten-4">
            {{ deleteDialogTitle }}
            <v-spacer />
            <v-btn small icon @click="dialogDeleteEndorsement = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text>
            {{ deleteDialogText }}
            <v-row no-gutters class="mt-2 caption">
              CDCR#: {{ selectedEndorsement.cdcrNumber }}
            </v-row>
            <v-row no-gutters class="mt-2 caption">
              Name:
              {{
                selectedEndorsement.firstName +
                ' ' +
                selectedEndorsement.lastName
              }}
            </v-row>
            <v-row no-gutters class="mt-2 caption">
              From Schedule: {{ selectedSchedule[0].title }}
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              text
              @click="onDeleteEndorsement(selectedEndorsement)"
            >
              Remove Endorsement
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-card>
</template>

<script>
  import { INST_ADMIN, INST_USER } from '@/helpers/appRoles.js';
  import svcTransfers from '@/feathers/services/transfer/transfer.service.js';
  import { get, sync, call } from 'vuex-pathify';
  import DatePicker from '@/components/util/DatePicker.vue';
  import InstitutionDropdown from '@/components/util/InstitutionDropdown.vue';
  import pdfMake from 'pdfmake/build/pdfmake';
  import pdfFonts from 'pdfmake/build/vfs_fonts';
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  import {
    headersSchedule,
    headersEndorsement,
    DELETE_DIALOG,
  } from '@/components/Schedule/constants.js';
  import BackToHome from '@/components/util/BackToHome.vue';
  import formatCaseFactors from '@/helpers/formatCaseFactors.js';
  import DataTableItem from '@/components/util/DataTableItem.vue';
  import scheduleModel from '@/models/scheduleModel';
  import create135 from '@/pdfs/create135';
  export default {
    components: { DatePicker, InstitutionDropdown, BackToHome, DataTableItem },
    name: 'Schedules',
    data: () => ({
      chkbxShowAllEndorsements: false,
      showAllEndorsements: false,
      enableEditing: false,
      title: '',
      selDestination: '',
      transferDate: null,
      seats: 0,
      dialogSchedule: false,
      dialogDeleteSchedule: false,
      dialogEndorsement: false,
      dialogDeleteEndorsement: false,
      disableSaveEndorsementButton: true,
      headersSchedule,
      headersEndorsement,
      editScheduleIndex: -1,
      editSchedule: scheduleModel(),
      selTransferReason: {
        reasonCode: '',
        reasonDesc: '',
      },
      endorsements: [],
      editEndorsementIndex: -1,
      editEndorsement: {},
      deleteDialogTitle: DELETE_DIALOG.DEFAULT.title,
      deleteDialogText: DELETE_DIALOG.DEFAULT.text,
      selectedEndorsement: [],
    }),
    async created() {
      this.onSelectedInstitution();
    },
    computed: {
      ...sync('institutions', ['listOfInstitutions']),
      ...sync('transfers', ['transferData', 'somsOffender']),
      ...sync('schedules', ['schedules', 'selSchedule']),
      ...get('users', ['loggedInUser']),
      ...get('reasons', ['reasons']),
      ...get('institutions', ['selectedInstitution', 'getInstitutionById']),
      ...sync('app', ['loading']),
      ...sync('destinations', ['destinations']),
      /**
       * ? The need for this computed comes from v-data-table
       * ? v-data-table wants the v-model to be an array
       */
      selectedSchedule: {
        get() {
          return [this.selSchedule];
        },
        set(value) {
          this.selSchedule = value[0];
        },
      },
      hasInstitutionRole() {
        return this.$hasAnyRoles([INST_ADMIN.name, INST_USER.name]);
      },
      listOfDestinations() {
        return this.listOfInstitutions
          .concat(this.destinations)
          .filter(
            (inst) =>
              this.selectedInstitution &&
              this.selectedInstitution.institutionName &&
              inst.institutionName !== this.selectedInstitution.institutionName
          )
          .sort(function (a, b) {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
            return a.institutionId.localeCompare(b.institutionId);
          });
      },
    },
    methods: {
      ...call('app', ['SET_SNACKBAR']),
      ...call('schedules', [
        'createSchedule',
        'readSchedules',
        'readSchedulesByDate',
        'readSchedulesByOrigin',
        'updateSchedule',
        'deleteSchedule',
      ]),
      ...call('transfers', [
        'readOffenderDetails',
        'readTransfers',
        'deleteTransfer',
        'saveForm',
      ]),
      // Example of how to change name of method call
      //   existing name       :  new name
      // { DeleteSchedule: 'deleteSchedule' }
      setSnackbar(msg, result, timeout) {
        this.SET_SNACKBAR({
          top: true,
          center: true,
          message: msg,
          color: result,
          timeout: timeout,
        });
      },
      async onSelectedInstitution() {
        this.endorsements = [];
        this.selectedSchedule = [scheduleModel()];
        if (this.selectedInstitution) {
          await this.readSchedules({
            query: { origin: this.selectedInstitution.institutionName },
          });
          if (
            this.loggedInUser &&
            this.loggedInUser.somsinfo &&
            this.loggedInUser.somsinfo.organizationName &&
            this.loggedInUser.somsinfo.organizationName ===
              this.selectedInstitution.institutionName
          ) {
            this.enableEditing = true;
          } else {
            this.enableEditing = false;
          }
        } else {
          this.schedules = [];
          this.enableEditing = false;
        }
      },
      async getOffender() {
        if (!this.editEndorsement.cdcrNumber) {
          return;
        }
        if (this.endorsements && this.endorsements.length > 0) {
          const item = this.endorsements.find(
            (offender) =>
              offender.cdcrNumber === this.editEndorsement.cdcrNumber
          );
          if (item) {
            this.openEndorsement(item);
            return;
          }
        }

        this.loading = true;
        try {
          await this.readOffenderDetails(this.editEndorsement.cdcrNumber);

          // console.log('getOffender(): this.transferData => ', this.transferData);

          if (
            this.loggedInUser &&
            this.loggedInUser.somsinfo &&
            this.loggedInUser.somsinfo.organizationName &&
            this.transferData &&
            this.transferData.institutionName &&
            this.transferData.institutionName !==
              this.loggedInUser.somsinfo.organizationName
          ) {
            const res = confirm(
              `This person's institutions does not match yours. Are you sure you want to proceed?`
            );
            if (!res) {
              this.loading = false;
              return;
            }
          }
          if (
            this.transferData.TransferHolds &&
            this.transferData.TransferHolds.length > 0
          ) {
            const resp = confirm(
              `This person has one or more holds! do you want to continue with this transfer?`
            );
            if (!resp) {
              this.loading = false;
              return;
            }
          }

          this.transferData.photograph = '';
          this.editEndorsement.cdcrNumber = this.transferData.cdcrNumber;
          this.editEndorsement.firstName = this.transferData.firstName;
          this.editEndorsement.lastName = this.transferData.lastName;
          // this.editEndorsement.ethnicity = this.transferData.ethnicity;
          this.editEndorsement.housing = this.transferData.housing;
          // this.editEndorsement.securityLevel = this.transferData.securityLevel;
          // this.editEndorsement.tbCode = this.transferData.tbCode;
          // this.editEndorsement.caseFactor = this.transferData.caseFactor;
          this.editEndorsement.currentEndorsementDate =
            this.transferData.originalEndorsementDate;
          setTimeout(() => {
            this.loading = false;
            this.disableSaveEndorsementButton = false;
          }, 500);
        } catch (error) {
          this.loading = false;
          this.setSnackbar(
            `An unexpected error occurred. Error code: ${error.Code}`,
            'info',
            3000
          );
        }
      },
      goHome() {
        this.$router.push({
          name: 'Home',
        });
      },
      async openSchedule(item) {
        await this.onSelectedSchedule({ item, value: true });
        this.editSchedule = JSON.parse(JSON.stringify(item));
      },
      /**
       * @param {Object} item - The schedule object meant for deletion
       */
      async onDeleteSchedule(item) {
        await this.onSelectedSchedule({ item, value: true });

        if (!this.selectedSchedule[0]._id) {
          const error = new Error(
            'No schedule selected or try again',
            this.selectedSchedule
          );
          this.setSnackbar(error.message);
          return;
        }

        if (this.endorsements.filter((e) => e.isScheduled).length) {
          this.deleteDialogText = DELETE_DIALOG.EXISTS.text;
          this.deleteDialogTitle = DELETE_DIALOG.EXISTS.title;
        } else {
          this.deleteDialogText = DELETE_DIALOG.DEFAULT.text;
          this.deleteDialogTitle = DELETE_DIALOG.DEFAULT.title;
        }

        if (!this.dialogDeleteSchedule) {
          this.dialogDeleteSchedule = true;
          return;
        }

        try {
          await this.deleteSchedule(this.selectedSchedule[0]);
        } catch (error) {
          console.error(error);
          this.setSnackbar(`Failed to delete schedule!`, 'error', 3000);
        } finally {
          this.endorsements = [];
          this.selectedSchedule = [scheduleModel()];
          this.dialogDeleteSchedule = false;
        }
      },
      async endorsementsExists(item) {
        let filter = {
          query: {
            $limit: 0,
            scheduleId: item._id,
          },
        };
        const response = await svcTransfers.find(filter);
        if (response && response.total) {
          return true;
        } else {
          return false;
        }
      },
      async saveSchedule() {
        const self = this;
        await setTimeout(async () => {
          console.log('saveSchedule(): editSchedule => ', self.editSchedule);
          if (
            !self.selectedInstitution ||
            !self.editSchedule.title ||
            !self.editSchedule.destination ||
            !self.editSchedule.transferDate ||
            self.editSchedule.seats == 0
          ) {
            alert('A required field is empty.');
            return;
          }

          // Move data from edit fields to
          //this.selSchedule = this.editSchedule;
          // Dropdown returns the destination as an object if user selects from list
          // Dropdowm returns the destination as a string if user types an entry manually
          if (
            self.editSchedule.destination &&
            typeof self.editSchedule.destination === 'object'
          ) {
            self.editSchedule.destination =
              self.editSchedule.destination.institutionId;
          }
          if (self.editSchedule._id) {
            try {
              // Update existing schedule
              await self.updateSchedule(self.editSchedule);
              this.setSnackbar(
                `Successfully updated schedule!`,
                'success',
                3000
              );
            } catch (e) {
              console.error(e);
              this.setSnackbar(`Failed to update schedule!`, 'error', 3000);
              return;
            }
          } else {
            // Create new schedule
            if (!self.editSchedule.origin) {
              self.editSchedule.origin =
                self.selectedInstitution.institutionName;
            }
            if (!self.editSchedule.originId) {
              self.editSchedule.originId =
                self.selectedInstitution.institutionId;
            }

            try {
              await self.createSchedule(self.editSchedule);
              this.setSnackbar(
                `Successfully created schedule!`,
                'success',
                3000
              );
            } catch (e) {
              console.error(e);
              this.setSnackbar(`Failed to create schedule!`, 'error', 3000);
              return;
            }
          }
          // Clear the edit boxes
          self.editSchedule = Object.assign({}, scheduleModel());

          try {
            await self.readSchedulesByOrigin({
              institution: self.selectedInstitution.institutionName,
            });
          } catch (e) {
            console.error(e);
          }
        }, 100);
      },
      transferReasonSelected(ctrl) {
        if (ctrl) {
          this.editEndorsement.transferReasonCode = ctrl.reasonCode;
          this.editEndorsement.transferReasonDesc = ctrl.reasonDesc;
        }
      },
      // eslint-disable-next-line no-unused-vars
      /**
       * @param {item: Object, value: Boolean} - An object with an item and value
       */
      async onSelectedSchedule(item) {
        this.editEndorsement = {};
        this.editSchedule = scheduleModel();

        if (item.value) {
          // Schedule Selected
          this.selectedSchedule = [item.item];
          console.log(this.selectedSchedule[0].destination);
          const result = this.listOfDestinations.find(
            (inst) =>
              this.selectedSchedule[0].destination === inst.institutionId
          );
          console.log('listOfDestinations.find(): ', result);
          if (result) {
            this.chkbxShowAllEndorsements = true;
          } else {
            this.chkbxShowAllEndorsements = false;
          }
          console.log(
            'chkbxShowAllEndorsements: ',
            this.chkbxShowAllEndorsements
          );
          await this.getEndorsements(item.item, {});
        } else {
          this.selectedSchedule = [scheduleModel()];
          this.endorsements = [];
        }
      },
      async onShowAllEndorsements() {
        await this.getEndorsements(this.selectedSchedule[0], {});
      },
      async getEndorsements(newVal, oldVal) {
        try {
          const oldId = oldVal._id || '';
          const newId = newVal._id || '';

          if (newId && newId !== oldId) {
            let filter = {};
            let result = this.listOfDestinations.find(
              (inst) => inst.institutionId === newVal.destination
            );
            if (result && !this.showAllEndorsements) {
              filter = {
                query: {
                  institutionName: this.selectedInstitution.institutionName,
                  endorsedToId: newVal.destination,
                  $or: [{ scheduleId: newId }, { isScheduled: false }],
                },
              };
            } else {
              filter = {
                query: {
                  institutionName: this.selectedInstitution.institutionName,
                  $or: [
                    { endorsedToId: newVal.destination },
                    { scheduleId: newId },
                    { isScheduled: false },
                  ],
                },
              };
            }

            // This accounts for schedules where the transfer date has past.
            let today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);
            let xfrDate = new Date(this.selectedSchedule[0].transferDate);
            if (today > xfrDate) {
              filter.query = {
                scheduleId: newId,
              };
            }
            let response = await this.readTransfers(filter);
            if (response) {
              this.endorsements = response;
            } else {
              this.endorsements = [];
            }
          } else {
            // console.log('getEndorsements(): ', newVal, oldVal);
          }
        } catch (error) {
          // console.error('getEndorsements', error);
          this.setSnackbar(
            'Failed to fetch endorsements, try again later.',
            'error',
            3000
          );
        }
        this.loading = false;
      },
      openEndorsement(item) {
        this.editEndorsement = Object.assign({}, item);
        this.selTransferReason = {
          reasonCode: this.editEndorsement.transferReasonCode,
          reasonDesc: this.editEndorsement.transferReasonDesc,
        };
        this.disableSaveEndorsementButton = false;
      },
      async onDeleteEndorsement(item) {
        const index = this.endorsements.indexOf(item);
        this.selectedEndorsement = item;

        if (!this.dialogDeleteEndorsement) {
          this.deleteDialogText = DELETE_DIALOG.ENDORSEMENT.text;
          this.deleteDialogTitle = DELETE_DIALOG.ENDORSEMENT.title;
          this.dialogDeleteEndorsement = true;
          return;
        }

        try {
          await this.deleteTransfer(item._id);
        } catch (ex) {
          console.error(ex);
          this.setSnackbar(`Failed to delete endorsement!`, 'error', 3000);
          return false;
        } finally {
          this.endorsements.splice(index, 1);
          this.editEndorsement = {};
          this.dialogDeleteEndorsement = false;
        }
      },
      async saveEndorsement() {
        if (this.editEndorsement._id) {
          this.transferData = this.editEndorsement;
        } else {
          if (this.selTransferReason) {
            this.transferData.transferReasonCode =
              this.selTransferReason.reasonCode;
            this.transferData.transferReasonDesc =
              this.selTransferReason.reasonDesc;
          }
        }

        try {
          let objIns = this.listOfInstitutions.find(
            (inst) =>
              this.transferData &&
              this.transferData.institutionName &&
              inst.institutionName === this.transferData.institutionName
          );
          if (!objIns) {
            this.setSnackbar(
              `Could not find institution in list of Institutions. Institution => ${this.transferData.institutionName}`,
              `error`,
              3000
            );
            return;
          }

          if (!this.transferData.institutionName) {
            this.transferData.institutionName = objIns.institutionName;
          }
          if (!this.transferData.institutionId) {
            this.transferData.institutionId = objIns.institutionId;
          }
          if (!this.transferData.institutionPartyId) {
            this.transferData.institutionPartyId = objIns.institutionPartyId;
          }

          objIns = this.listOfInstitutions.find(
            (inst) =>
              this.transferData &&
              this.transferData.endorsedToName &&
              inst.institutionName === this.transferData.endorsedToName
          );
          if (!this.transferData.endorsedToName) {
            this.transferData.endorsedToName = objIns.institutionName;
          }
          if (!this.transferData.endorsedToId) {
            this.transferData.endorsedToId = objIns.institutionId;
          }
          if (!this.transferData.endorsedToPartyId) {
            this.transferData.endorsedToPartyId = objIns.institutionPartyId;
          }

          this.transferData.caseFactor = formatCaseFactors(this.somsOffender);

          const response = await this.saveForm();
          if (response && response._id) {
            this.setSnackbar('Success!', 'success', 3000);
            this.editEndorsement = {};
            this.selTransferReason = null;
            this.disableSaveEndorsementButton = true;
            await this.getEndorsements(this.selectedSchedule[0], {});
          }
        } catch (ex) {
          console.error(ex);
          this.setSnackbar(`Failure!`, 'error', 3000);
          return false;
        }
      },
      async print135BySchedule(schedule) {
        const filter = {
          query: {
            $limit: 50,
            $sort: {
              transferDate: 1,
            },
            scheduleId: schedule._id,
          },
        };
        const transfers = await this.readTransfers(filter);
        await create135(schedule, transfers);
      },
      async print135ByCdcrNumber(item) {
        await create135(this.selSchedule, [item]);
      },
      onClearCDCRNumber() {
        this.editEndorsement = {};
        this.disableSaveEndorsementButton = true;
        this.selTransferReason = {};
      },
      onChangeCDCRNumber() {
        if (this.editEndorsement.cdcrNumber) {
          this.editEndorsement.cdcrNumber =
            this.editEndorsement.cdcrNumber.toUpperCase();
        } else {
          this.editEndorsement = {};
          this.disableSaveEndorsementButton = true;
          this.selTransferReason = {};
        }
      },
    },
  };
</script>

<style>
  tr.v-data-table__selected {
    background: #7d92f5 !important;
  }
  .selInstitution {
    background-color: white;
    border-radius: 5px;
  }
  .btns {
    width: 80px;
  }
</style>
