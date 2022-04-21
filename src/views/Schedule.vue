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
            v-model="selectedInstitution"
            :loading="loading"
            @change="onSelectedInstitution"
          />
        </v-col>
        <v-col align="right" align-self="center">
          <!-- <v-btn class="secondary ma-2" @click="dialogSchedule = true">
            Create Schedule
          </v-btn> -->
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
      <!-- Data table will push to selSchedule -->
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
          <v-toolbar
            flat
            color="white"
            v-show="
              enableEditing &&
              $hasAnyRoles(['Institution Administrator', 'Institution User'])
            "
          >
            <v-col cols="1" sm="2" lg="1" align-self="baseline">
              <v-text-field
                label="Schedule"
                v-model="editSchedule.title"
              ></v-text-field>
            </v-col>
            <v-col cols="2" sm="4" lg="2" align-self="baseline">
              <!-- 
                Filtering out selectedInstitution from the list
                Destination cannot be the origin.
              -->
              <v-select
                label="Destination"
                v-model="editSchedule.destination"
                :items="
                  listOfInstitutions.filter(
                    (inst) =>
                      selectedInstitution &&
                      selectedInstitution.institutionName &&
                      inst.institutionName !==
                        selectedInstitution.institutionName
                  )
                "
                item-text="institutionId"
                item-value="institutionId"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="2" sm="4" lg="2" align-self="baseline">
              <v-select
                label="Vias"
                v-model="editSchedule.vias"
                :items="Vias"
                item-text="institutionName"
                item-value="institutionName"
                multiple
                clearable
              ></v-select>
            </v-col>
            <v-col cols="2" sm="4" lg="2" align-self="start">
              <DatePicker
                label="Transfer Date"
                v-model="editSchedule.transferDate"
                align="top"
                pickerType="DATE"
              />
            </v-col>
            <v-col cols="1" sm="2" lg="1" align-self="baseline">
              <v-text-field
                label="Seats"
                v-model="editSchedule.seats"
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="1" sm="2" lg="1" align-self="center">
              <v-btn class="secondary ma-2 btns" @click="saveSchedule()">
                <!-- {{ btnAddEditSchedule }} -->
                SAVE
              </v-btn>
            </v-col>
            <v-col cols="1" sm="2" lg="1" align-self="center" align="right">
              <v-btn class="secondary ma-2 btns">Filter</v-btn>
            </v-col>
          </v-toolbar>
        </template>
        <template v-slot:item.print135="{ item }">
          <v-icon
            color="primary"
            class="ml-5"
            @click="create135(item, 'schedule')"
          >
            mdi-file-document
          </v-icon>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openSchedule(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="scheduleDelete(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:no-data>
          <span>No Results</span>
        </template>
      </v-data-table>
      <v-card v-show="selectedSchedule.length >= 1" class="mt-2 pb-4">
        <v-card-title class="blue-grey lighten-4">
          <v-row>
            <v-col cols="2" xs="12" sm="2" class="py-1" align-self="center">
              <span>Endorsements</span>
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
            <v-toolbar
              flat
              color="white"
              v-show="
                enableEditing &&
                $hasAnyRoles(['Institution Administrator', 'Institution User'])
              "
            >
              <v-col cols="1" sm="2" lg="1" align-self="baseline">
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
              <v-col cols="1" sm="3" lg="1" align-self="baseline">
                <v-text-field
                  label="Last Name"
                  v-model="editEndorsement.lastName"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="1" sm="3" lg="1" align-self="baseline">
                <v-text-field
                  label="First Name"
                  v-model="editEndorsement.firstName"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="1" sm="2" lg="1" align-self="baseline">
                <v-text-field
                  label="Housing"
                  v-model="editEndorsement.housing"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="2" sm="3" lg="2" align-self="baseline">
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
              <v-col cols="2" sm="3" lg="2" align-self="baseline">
                <v-text-field
                  label="Endorsement Date"
                  v-model="editEndorsement.currentEndorsementDate"
                  readonly
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="1" sm="2" lg="1" align-self="center">
                <v-btn
                  :disabled="disableSaveEndorsementButton"
                  class="secondary ma-2 btns"
                  @click="saveEndorsement()"
                >
                  SAVE
                </v-btn>
              </v-col>
              <v-col cols="1" sm="2" lg="1" align-self="center" align="right">
                <v-btn class="secondary ma-2 btns">Filter</v-btn>
              </v-col>
            </v-toolbar>
          </template>

          <template v-slot:item.cdcrNumber="{ item }">
            <router-link
              :to="{
                name: 'Transfer Details',
                params: { cdcrNumber: item.cdcrNumber },
              }"
              >{{ item.cdcrNumber }}</router-link
            >
          </template>
          <template v-slot:item.isScheduled="{ item }">
            {{ item.isScheduled ? 'Y' : 'N' }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="openEndorsement(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteEndorsement(item)">mdi-delete</v-icon>
          </template>
          <template v-slot:item.print="{ item }">
            <v-icon
              color="primary"
              class="ml-5"
              @click="create135(item, 'cdcrNumber')"
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
    </v-card>
  </v-card>
</template>

<script>
  import somsOffender from '@/feathers/services/offender/details.service.js';
  import svcTransfers from '@/feathers/services/transfer/transfer.service.js';
  // import svcSchedule from '@/feathers/services/offender/details.service.js';
  import { get, sync, call } from 'vuex-pathify';
  import DatePicker from '@/components/util/DatePicker.vue';
  import InstitutionDropdown from '@/components/util/InstitutionDropdown.vue';
  import pdfMake from 'pdfmake/build/pdfmake';
  import pdfFonts from 'pdfmake/build/vfs_fonts';
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  import {
    headersSchedule,
    headersEndorsement,
  } from '@/components/Schedule/constants.js';
  import BackToHome from '@/components/util/BackToHome.vue';
  // import endorsedOffenders from '@/feathers/services/offender/endorsed.service.js';

  export default {
    components: { DatePicker, InstitutionDropdown, BackToHome },
    name: 'Schedules',

    data: () => ({
      enableEditing: false,
      selectedSchedule: [],
      loading: false,
      title: '',
      selDestination: '',
      selVias: '',
      transferDate: null,
      seats: 0,
      dialogSchedule: false,
      dialogDeleteSchedule: false,
      dialogEndorsement: false,
      dialogDeleteEndorsement: false,
      disableSaveEndorsementButton: true,
      headersSchedule,
      headersEndorsement,
      Vias: ['FOL-II', 'SAC-II', 'CSP-II', 'ASP-II', 'RJD-II', 'CMC-II'],
      editScheduleIndex: -1,
      editSchedule: {
        id: '',
        origin: '',
        originId: '',
        destination: '',
        title: '',
        vias: [],
        transferDate: '',
        seats: 0,
      },
      defaultSchedule: {
        id: '',
        origin: '',
        originId: '',
        destination: '',
        title: '',
        vias: [],
        transferDate: '',
        seats: 0,
      },
      selTransferReason: {
        reasonCode: '',
        reasonDesc: '',
      },
      endorsements: [],
      editEndorsementIndex: -1,
      editEndorsement: {
        cdcrNumber: '',
        firstName: '',
        lastName: '',
        ethnicity: '',
        housing: '',
        securityLevel: '',
        tbCode: '',
        caseFactor: '',
        releaseDate: null,
        originalEndorsementDate: null,
        currentEndorsementDate: null,
        transferDate: null,
        scheduleName: '',
        scheduleId: '',
        transferReasonCode: '',
        transferReasonDesc: '',
        transferReason: {
          reasonCode: '',
          reasonDesc: '',
        },
        comments: '',
        inHouseRemarks: '',
        // endorsementDetails: '',
      },
      defaultEndorsement: {
        cdcrNumber: '',
        firstName: '',
        lastName: '',
        ethnicity: '',
        housing: '',
        securityLevel: '',
        tbCode: '',
        caseFactor: '',
        releaseDate: null,
        originalEndorsementDate: null,
        currentEndorsementDate: null,
        transferDate: null,
        scheduleName: '',
        scheduleId: '',
        transferReasonCode: '',
        transferReasonDesc: '',
        transferReason: {
          reasonCode: '',
          reasonDesc: '',
        },
        comments: '',
        inHouseRemarks: '',
        // endorsementDetails: '',
      },
    }),
    async created() {
      this.onSelectedInstitution();
    },
    computed: {
      // ...get('institutions', ['listOfInstitutions']),
      ...sync('institutions', ['selectedInstitution', 'listOfInstitutions']),
      ...sync('transfers', ['transferData']),
      ...sync('schedules', ['schedules', 'selSchedule']),
      ...get('users', ['loggedInUser']),
      ...get('reasons', ['reasons']),
      ...get('institutions', ['getInstitutionById']),
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
      ...call('transfers', ['readTransfers', 'deleteTransfer', 'saveForm']),
      // Example of how to change name of method call
      //   new name       :  existing name
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
        this.selSchedule = {};
        this.selectedSchedule = [];
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
          // console.log(
          //   'onSelectedInstitution(): selectedSchedule',
          //   this.selectedSchedule
          // );
        } else {
          // console.log(
          //   'onSelectedInstitution(): selectedSchedule',
          //   this.selectedSchedule
          // );
          this.schedules = [];
          this.enableEditing = false;
        }
      },
      async getOffender() {
        if (!this.editEndorsement.cdcrNumber) {
          return;
        }
        this.loading = true;
        try {
          const query = {
            query: {
              cdcrnumber: this.editEndorsement.cdcrNumber,
            },
          };

          const offenderInfo = await somsOffender.find(query);

          if (offenderInfo.data.length > 0) {
            const person = offenderInfo.data[0];
            // console.log('searchOffender(): offender => ', offenderInfo.data[0]);
            if (
              this.loggedInUser &&
              this.loggedInUser.somsinfo &&
              this.loggedInUser.somsinfo.organizationName &&
              person &&
              person.institutionName &&
              person.institutionName !==
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
            if (person.TransferHolds && person.TransferHolds.length > 0) {
              const resp = confirm(
                `This person has one or more holds! do you want to continue with this transfer?`
              );
              if (!resp) {
                this.loading = false;
                return;
              }
            }

            this.editEndorsement.cdcrNumber = person.cdcrNumber;
            this.editEndorsement.firstName = person.firstName;
            this.editEndorsement.lastName = person.lastName;
            this.editEndorsement.ethnicity = person.ethnicity;
            this.editEndorsement.housing = person.housingArea;
            this.editEndorsement.securityLevel = person.securityLevel;
            this.editEndorsement.tbCode = person.tbCode;
            // this.editEndorsement.caseFactor = person.caseFactor;
            this.editEndorsement.currentEndorsementDate = person.endorsedDate;
            setTimeout(() => {
              this.loading = false;
              this.displayOffender = true;
              this.disableSaveEndorsementButton = false;
            }, 500);

            this.somsCDCRNumber = '';
            return offenderInfo;
          } else {
            this.loading = false;
            this.searchOffenderNotFoundErrorDialog = true;
          }
        } catch (error) {
          this.loading = false;
          if (error.code == 500) {
            this.searchOffenderNotFoundErrorDialog = true;
          } else if (error.message == 'You do not belong to this institution') {
            this.offenderSearchPermissionDialog = true;
          } else {
            // Display a message that an error occurred!!!
          }
        }
      },
      goHome() {
        this.$router.push({
          name: 'Home',
        });
      },
      openSchedule(item) {
        //console.log('openSchedule(): schedule => ', item);
        this.editSchedule = Object.assign({}, item);
      },
      async removeSchedule(id) {
        if (id) {
          try {
            await this.deleteSchedule(id);
            this.setSnackbar('Successfully deleted schedule!', 'success', 3000);
          } catch (ex) {
            console.error(ex);
            this.setSnackbar(`Failed to delete schedule!`, 'error', 3000);
            return false;
          }
        } else {
          this.setSnackbar('Cannot remove schedule. id = ', id);
          return false;
        }

        return true;
      },
      async endorsementsExists(item) {
        let filter = {
          query: {
            $limit: 0,
            scheduleId: item._id,
          },
        };
        // console.log('filter : ', filter);
        const response = await svcTransfers.find(filter);
        // console.log('endorsementsExists(): response => ', response);
        if (response && response.total > 0) {
          return true;
        } else {
          return false;
        }
      },
      async scheduleDelete(item) {
        // console.log('scheduleDelete(): item => ', item);
        const exists = await this.endorsementsExists(item);
        // console.log('scheduleDelete(): exists => ', exists);
        if (exists) {
          this.setSnackbar(
            'Please delete the transfers assigned to the schedule before deleting the scdedule.',
            'error',
            5000
          );
          return;
        }

        const index = this.schedules.indexOf(item);

        let res = confirm('Are you sure you want to delete this schedule?');
        if (res) {
          res = this.removeSchedule(item._id);
          if (res) {
            this.schedules.splice(index, 1);
          }
        }
      },
      async saveSchedule() {
        const self = this;
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
        if (self.editSchedule._id) {
          try {
            await self.updateSchedule(self.editSchedule);
            this.setSnackbar(`Successfully updated schedule!`, 'success', 3000);
          } catch (e) {
            console.error(e);
            this.setSnackbar(`Failed to update schedule!`, 'error', 3000);
            return;
          }
        } else {
          if (!self.editSchedule.origin) {
            self.editSchedule.origin = self.selectedInstitution.institutionName;
          }
          if (!self.editSchedule.originId) {
            self.editSchedule.originId = self.selectedInstitution.institutionId;
          }

          try {
            await self.createSchedule(self.editSchedule);
            this.setSnackbar(`Successfully created schedule!`, 'success', 3000);
          } catch (e) {
            console.error(e);
            this.setSnackbar(`Failed to create schedule!`, 'error', 3000);
            return;
          }
        }
        // Clear the edit boxes
        self.editSchedule = Object.assign({}, self.defaultSchedule);

        const dt = Date.now();
        console.log(dt);
        try {
          await self.readSchedulesByOrigin({
            institution: self.selectedInstitution.institutionName,
          });
        } catch (e) {
          console.error(e);
        }
      },
      transferReasonSelected(ctrl) {
        // console.log('transferReasonSelected(): ', ctrl);
        if (ctrl) {
          this.editEndorsement.transferReasonCode = ctrl.reasonCode;
          this.editEndorsement.transferReasonDesc = ctrl.reasonDesc;
        }
      },
      // eslint-disable-next-line no-unused-vars
      onSelectedSchedule(item) {
        if (item.value) {
          // Schedule Selected
          this.selSchedule = item.item;
          this.getEndorsements(item.item, {});
        } else {
          this.selSchedule = {};
          this.endorsements = [];
        }
      },
      async getEndorsements(newVal, oldVal) {
        // console.log('getEndorsements(): newVal => ', newVal);
        // console.log('getEndorsements(): oldVal => ', oldVal);
        try {
          const oldId = oldVal._id || '';
          const newId = newVal._id || '';

          if (newId && newId !== oldId) {
            let filter = {
              query: {
                endorsedToId: newVal.destination,
                $or: [{ scheduleId: newId }, { isScheduled: false }],
              },
            };
            console.log('getEndorsements(): filter : ', filter);
            // console.log('newId', newId);
            // const response = await svcTransfers.find(filter);
            let response = await this.readTransfers(filter);
            if (response) {
              this.endorsements = response;
            } else {
              this.endorsements = [];
            }
          }
        } catch (error) {
          console.error('getEndorsements', error);
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
      async removeEndorsement(id) {
        if (id) {
          try {
            await this.deleteTransfer(id);
            this.setSnackbar(
              'Successfully deleted endorsement!',
              'success',
              3000
            );
          } catch (ex) {
            console.error(ex);
            this.setSnackbar(`Failed to delete endorsement!`, 'error', 3000);
            return false;
          }
        } else {
          this.setSnackbar('Cannot remove endorsement. id = ', id);
          return false;
        }

        return true;
      },
      deleteEndorsement(item) {
        // console.log('deleteEndorsement(): item => ', item);
        const index = this.endorsements.indexOf(item);

        let res = confirm('Are you sure you want to delete this endorsement?');
        if (res) {
          res = this.removeEndorsement(item._id);
          if (res) {
            this.endorsements.splice(index, 1);
            this.editEndorsement = Object.assign({}, this.defaultEndorsement);
          }
        }
      },
      async saveEndorsement() {
        // console.log(
        //   'saveEndorsement() this.editEndorsement => ',
        //   this.editEndorsement
        // );

        // Assign the endorsement to the transferData object
        // And have saveForm save the transferData
        this.transferData = this.editEndorsement;

        try {
          const response = await this.saveForm();
          if (response && response._id) {
            this.setSnackbar('Success!', 'success', 3000);
            this.editEndorsement = Object.assign({}, this.defaultEndorsement);
            this.selTransferReason = null;
            this.disableSaveEndorsementButton = true;

            await this.getEndorsements(this.selSchedule, {});
          }
        } catch (ex) {
          console.error(ex);
          this.setSnackbar(`Failure!`, 'error', 3000);
          return false;
        }
      },
      // getInstitutionId(location)
      // Returns the abbreviated institution id
      // for the provided location
      getInstitutionId(location) {
        if (!location) {
          // FIXME write out an error message
          return '';
        }

        console.log('getInstitutionId(): location => ', location);
        console.log(
          'getInstitutionId(): listOfInstitutions',
          this.listOfInstitutions
        );
        for (let i of this.listOfInstitutions) {
          // console.log('getInstitutionId(): i => ', i);
          if (i.institutionName == location) {
            return i.institutionId;
          }
        }

        return 'NF';
      },
      // eslint-disable-next-line no-unused-vars
      async create135(item, param) {
        let filter = {
          query: {
            $limit: 50,
            $sort: {
              transferDate: 1,
            },
          },
        };
        if (param == 'schedule' && item._id) {
          filter.query.scheduleId = item._id;
        } else if (param == 'cdcrNumber' && item.cdcrNumber) {
          // let today = new Date().toISOString().split('T')[0];
          filter.query.cdcrNumber = item.cdcrNumber;
          // filter.query.transferDate = { $gte: today };
        } else {
          alert('Invalid option for CDCR-135 Transfer Record.');
          return;
        }
        try {
          console.log('create135(): filter => ', filter);
          this.transfers = await this.readTransfers(filter);
          console.log('create135(): transfers => ', this.transfers);
          if (!this.transfers) {
            alert('No Transfers found for schedule: ', item.schedule.title);
            return;
          }
        } catch (ex) {
          console.error('create135() exception: ', ex);
        }

        let data = [];
        // let row = [];
        const obj = {
          text: '',
          style: 'tblData',
          border: [false, false, false, false],
        };
        let num = 1;
        for (let xfr of this.transfers) {
          const row = [];
          // Column 1 - Row Number
          obj.text = String(num++);
          row.push(Object.assign({}, obj));
          // Column 2 - CDCR Number
          obj.text = xfr.cdcrNumber;
          row.push(Object.assign({}, obj));
          // Column 3 - Name
          obj.text = xfr.lastName + ', ' + xfr.firstName;
          row.push(Object.assign({}, obj));
          // Column 4 - Level
          obj.text = xfr.securityLevel;
          row.push(Object.assign({}, obj));
          // Column 5 - Housing
          obj.text = xfr.housing;
          row.push(Object.assign({}, obj));
          // Column 6 - TB Code
          obj.text = xfr.tbCode;
          row.push(Object.assign({}, obj));
          // Column 7 - Ethnic
          obj.text = xfr.ethnicity;
          row.push(Object.assign({}, obj));
          // Column 8 - Case Factor
          obj.text = xfr.caseFactor;
          row.push(Object.assign({}, obj));
          // Column 9 - Specific Transfer Reason
          obj.text = xfr.transferReasonCode;
          row.push(Object.assign({}, obj));
          // Column 10 - Comments
          obj.text = xfr.comments;
          row.push(Object.assign({}, obj));
          data.push(row);
        }
        console.log('create135(): data => ', data);
        if (data) {
          this.create135PDF(data, item, param);
        } else {
          // error message
          alert('Could not create CDCR 135 PDF Document!');
        }
      },
      // create135PDF()
      //
      create135PDF(data, item, param) {
        console.log('create135PDF(): data => ', data);

        // const fileName = this.fileName + '.pdf';
        const stateOf = 'STATE OF CALIFORNIA';
        const agency = 'DEPARTMENT OF CORRECTIONS AND REHABILITATION';
        const report135 = 'CDCR 135 (Rev. 03/06)';

        const doc = `${stateOf}\n${report135}\nDISTRIBUTION PER INSTITUTION POLICY`;
        const reportTitle = 'TRANSFER RECORD';

        let dtLabel =
          'The following identified persons will be transferred this date';

        let today = Date.now();
        let fileName = '';
        if (param == 'cdcrNumber') {
          fileName = `135_${item.cdcrNumber}_${today}.pdf`;
          item = this.selSchedule;
        } else {
          fileName = `135_${item.title}_${today}.pdf`;
        }

        // let xfrNum = this.schedules[0].length;
        let xfrNum = data.length;
        let title = item.title;
        let to = item.destination;
        let from = this.getInstitutionId(item.origin);
        let vias = item.vias;
        let xfrDate = item.transferDate;

        let dd = {
          pageSize: 'LETTER',
          pageMargins: [10, 80, 10, 160],
          borders: [true, true, true, true],
          header: function () {
            //currentPage, pageCount, pageSize) {
            let header = {
              margin: [10, 10, 10, 10],
              table: {
                widths: ['auto', '*', 'auto'],
                body: [
                  // Row 1 - Title
                  [
                    {
                      text: doc,
                      style: 'hdrLeft',
                      border: [true, true, false, true],
                    },
                    {
                      text: reportTitle,
                      style: 'tblCenter',
                      border: [false, true, false, true],
                      // alignment: 'center',
                    },
                    {
                      text: agency,
                      style: 'hdrRight',
                      border: [false, true, true, true],
                      // alignment: 'right',
                    },
                  ],
                  // Row 2 - Header Row 1
                  [
                    {
                      text: dtLabel,
                      style: 'hdrSchedule',
                      border: [true, true, false, true],
                    },
                    {
                      text: 'DATE:  ' + xfrDate,
                      style: 'hdrSchedule',
                      border: [false, true, false, true],
                    },
                    {
                      text: 'NUMBER TRANSFERRING:  ' + xfrNum,
                      style: 'hdrSchedule',
                      border: [false, true, true, true],
                    },
                  ],
                  // Row 3 - Header Row 2
                  [
                    {
                      table: {
                        widths: ['*', '*', '*', '*'],
                        body: [
                          [
                            {
                              text: 'SCHEDULE:  ' + title,
                              style: 'hdrSchedule',
                              border: [false, false, false, false],
                            },
                            {
                              text: 'FROM:  ' + from,
                              style: 'hdrSchedule',
                              border: [false, false, false, false],
                            },
                            {
                              text: 'TO:  ' + to,
                              style: 'hdrSchedule',
                              border: [false, false, false, false],
                            },
                            {
                              text: 'VIAS:  ' + vias,
                              style: 'hdrSchedule',
                              border: [false, false, false, false],
                            },
                          ],
                        ],
                      },
                      colSpan: 3,
                      margins: [0, 0, 0, 0],
                    },
                    {},
                    [],
                  ],
                ],
              },
            };

            return header;
          },

          footer: function (currentPage, pageCount) {
            let footer = {
              margin: [10, 10, 10, 10],
              table: {
                widths: ['35%', '30%', '35%'],
                body: [
                  [
                    // Row 1
                    {
                      text: 'PREPARED BY',
                      style: 'hdrSchedule',
                      border: [true, true, false, true],
                      margin: [2, 2, 2, 16],
                    },
                    {
                      text: 'TITLE',
                      style: 'hdrSchedule',
                      border: [false, true, false, true],
                      margin: [2, 2, 2, 16],
                    },
                    {
                      text: 'SENDING INSTITUTION',
                      style: 'hdrSchedule',
                      border: [false, true, true, true],
                      margin: [2, 2, 2, 16],
                    },
                  ],
                  [
                    // Row 2
                    {
                      text: 'Receipt of the above-name persons and their records is acknowledged',
                      fontSize: 8,
                      alignment: 'center',
                      margin: [2, 2, 2, 16],
                      colSpan: 3,
                    },
                    {},
                    {},
                  ],
                  [
                    {
                      text: 'SIGNATURE OF TRANSPORTING OFFICER',
                      style: 'hdrSchedule',
                      border: [true, true, false, true],
                      margin: [2, 2, 2, 16],
                    },
                    {
                      text: 'TITLE',
                      style: 'hdrSchedule',
                      border: [false, true, false, true],
                      margin: [2, 2, 2, 16],
                    },
                    {
                      text: 'INSTITUTION',
                      style: 'hdrSchedule',
                      border: [false, true, true, true],
                      margin: [2, 2, 2, 16],
                    },
                  ],
                  [
                    {
                      text: 'SIGNATURE OF RECEIVING OFFICER',
                      style: 'hdrSchedule',
                      border: [true, true, false, true],
                      margin: [2, 2, 2, 16],
                    },
                    {
                      text: 'TITLE',
                      style: 'hdrSchedule',
                      border: [false, true, false, true],
                      margin: [2, 2, 2, 16],
                    },
                    {
                      text: 'INSTITUTION',
                      style: 'hdrSchedule',
                      border: [false, true, true, true],
                      margin: [2, 2, 2, 16],
                    },
                  ],
                  [
                    {
                      text: currentPage.toString() + ' of ' + pageCount,
                      fontSize: 9,
                      alignment: 'center',
                      border: [false, false, false, false],
                      colSpan: 3,
                    },
                    {},
                    {},
                  ],
                ],
              },
            };

            return footer;
          },

          content: [
            {
              style: '',
              layout: {
                // code from lightHorizontalLines:
                hLineWidth: function (i, node) {
                  if (i === 0 || i === node.table.body.length) {
                    return 0;
                  }
                  return i === node.table.headerRows ? 2 : 1;
                },
                // eslint-disable-next-line no-unused-vars
                vLineWidth: function (i) {
                  return 0;
                },
                hLineColor: function (i) {
                  return i === 1 ? 'black' : '#aaa';
                },
                paddingLeft: function (i) {
                  return i === 0 ? 0 : 8;
                },
                paddingRight: function (i, node) {
                  return i === node.table.widths.length - 1 ? 0 : 8;
                },
                // code for zebra style:
                fillColor: function (i) {
                  return i % 2 !== 0 ? '#F0F0F0' : null;
                },
              },
              table: {
                layout: 'lightHorizontalLines',
                headerRows: 1,
                widths: [
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  '*',
                ],
                body: [
                  [
                    { text: '#', style: 'tblHeader' },
                    { text: 'CDCR #', style: 'tblHeader' },
                    { text: 'Name', style: 'tblHeader' },
                    { text: 'Level', style: 'tblHeader' },
                    { text: 'Housing', style: 'tblHeader' },
                    { text: 'TB Cd', style: 'tblHeader' },
                    { text: 'Ethnic', style: 'tblHeader' },
                    { text: 'Case Factor', style: 'tblHeader' },
                    {
                      // text: 'Specific Transfer Reason',
                      text: 'Reason',
                      style: 'tblHeader',
                    },
                    { text: 'Comments', style: 'tblHeader' },
                  ],
                  ...data,
                ],
              },
            },
          ],
          styles: {
            hdrLeft: {
              bold: true,
              fontSize: 7,
            },
            hdrRight: {
              alignment: 'right',
              bold: true,
              fontSize: 8,
            },
            hdrSchedule: {
              bold: true,
              fontSize: 8,
            },
            tblHeader: {
              bold: true,
              fontSize: 8,
              color: 'black',
            },
            tblData: {
              fontSize: 9,
            },
            tblCenter: {
              alignment: 'center',
              bold: true,
              fontSize: 10,
            },
          },
        };

        console.log('create135PDF(): dd => ', dd);
        pdfMake.createPdf(dd).download(fileName);
        // alert("create135PDF() Done!");
      },
      onClearCDCRNumber() {
        this.editEndorsement = Object.assign({}, this.defaultEndorsement);
        this.disableSaveEndorsementButton = true;
        this.selTransferReason = {};
      },
      onChangeCDCRNumber() {
        if (this.editEndorsement.cdcrNumber) {
          this.editEndorsement.cdcrNumber =
            this.editEndorsement.cdcrNumber.toUpperCase();
        } else {
          this.editEndorsement = Object.assign({}, this.defaultEndorsement);
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
