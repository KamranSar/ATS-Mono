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
          <v-autocomplete
            v-model="selectedInstitution"
            return-object
            @change="initialize"
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
          >
          </v-autocomplete>
        </v-col>
        <v-col align="right" align-self="center">
          <!-- <v-btn class="secondary ma-2" @click="dialogSchedule = true">
            Create Schedule
          </v-btn> -->
          <v-icon small color="primary" right>mdi-arrow-left</v-icon>
          <a @click="goHome" class="text-decoration-none subtitle-2">
            Back to Home
          </a>
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
        v-model="selSchedule"
        :headers="headersSchedule"
        item-key="_id"
        :items="schedules"
        single-select
        show-select
        sort-by="scheduleId"
        class="elevation-1 pa-2 mt-2"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <!-- <v-toolbar-title>FOLSOM STATE PRISON - Schedules</v-toolbar-title> -->
            <v-col cols="1" sm="2" lg="1" align-self="baseline">
              <v-text-field
                label="Schedule"
                v-model="editSchedule.title"
              ></v-text-field>
            </v-col>
            <v-col cols="2" sm="4" lg="2" align-self="baseline">
              <v-select
                label="Destination"
                v-model="editSchedule.destination"
                :items="listOfInstitutions"
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
            <!-- <v-col cols="1" sm="2" lg="1" align-self="center">
            <v-text-field label="Via 2" v-model="via2"></v-text-field>
          </v-col> -->
            <!-- <v-col cols="2" sm="4" lg="2" align-self="baseline">
              <v-text-field
                label="Transfer Date"
                v-model="editSchedule.transferDate"
              ></v-text-field>
            </v-col> -->
            <v-col cols="2" sm="4" lg="2" align-self="start">
              <DatePicker
                label="Transfer Date"
                v-model="editSchedule.transferDate"
                align="top"
              />
              <!-- <v-date-picker
              label="Transfer Date"
              v-model="transferDate"
            ></v-date-picker> -->
            </v-col>
            <v-col cols="1" sm="2" lg="1" align-self="baseline">
              <v-text-field
                label="Seats"
                v-model="editSchedule.seats"
              ></v-text-field>
            </v-col>
            <!-- <v-col cols="5" sm="1" md="2" lg="5">&nbsp;</v-col> -->
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
          <router-link to="">
            {{ item.print135 }}
            <v-icon color="primary" class="ml-5">mdi-file-document</v-icon>
          </router-link>
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
    </v-card>
    <!-- /* Endorsement Table Begin    */ -->
    <v-card v-show="selSchedule.length" class="mt-2">
      <v-card-title class="blue-grey lighten-4">
        <v-row>
          <v-col cols="2" xs="12" sm="2" class="py-1" align-self="center">
            <span>Endorsements</span>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-card-title>
      <v-data-table
        :headers="headersEndorsements"
        :items="endorsements"
        sort-by="lastName"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-col cols="1" sm="2" lg="1" align-self="baseline">
              <v-text-field
                label="CDCR #"
                v-model="editEndorsement.cdcrNumber"
                @blur="getOffender"
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
                dense
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
            <!-- <v-col cols="1" sm="3" lg="2" align-self="baseline">
              <v-text-field
                label="Endorsement Details"
                v-model="editEndorsement.endorsementDetails"
                readonly
              ></v-text-field>
            </v-col> -->
            <v-col cols="1" sm="2" lg="1" align-self="center">
              <v-btn class="secondary ma-2 btns" @click="saveEndorsement()">
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

        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openEndorsement(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteEndorsement(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:item.print="{ item }">
          <router-link to="">
            {{ item.print }}
            <v-icon color="primary" class="ml-5">mdi-file-document</v-icon>
          </router-link>
        </template>
        <template v-slot:no-data>
          <span>No Results</span>
        </template>
      </v-data-table>
      <!-- </div> -->
    </v-card>
    <!-- /* Endorsement Table end    */ -->
  </v-card>
</template>

<script>
  import somsOffender from '@/feathers/services/offender/details.service.js';
  import svcTransfers from '@/feathers/services/transfer/transfer.service.js';
  // import svcSchedule from '@/feathers/services/offender/details.service.js';
  import { get, sync, call } from 'vuex-pathify';
  import DatePicker from '@/components/util/DatePicker.vue';

  export default {
    components: { DatePicker },
    name: 'Schedules',

    data: () => ({
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
      headersSchedule: [
        { text: 'Schedule', value: 'title' },
        {
          text: 'Destination',
          align: 'start',
          sortable: false,
          value: 'destination',
        },
        { text: 'via', value: 'vias' },
        // { text: 'via 2', value: 'via' },
        { text: 'Transfer Date', value: 'transferDate' },
        { text: 'Seats', value: 'seats' },
        // { text: 'Remaining Seats', value: 'remainingSeats' },
        { text: 'Print-135', value: 'print135' },
        { text: 'Edit/Delete', value: 'actions', sortable: false },
      ],
      headersEndorsements: [
        {
          text: 'CDCR Number',
          align: 'start',
          sortable: false,
          value: 'cdcrNumber',
        },
        { text: 'Last Name', value: 'lastName' },
        { text: 'First Name', value: 'firstName' },
        { text: 'Housing', value: 'housing' },
        { text: 'Transfer Reason', value: 'transferReasonCode' },
        { text: 'Endorsement Date', value: 'currentEndorsementDate' },
        // { text: 'Endorsement Details', value: 'endorsementDetails' },
        { text: 'Print', value: 'print' },
        { text: 'Edit/Delete', value: 'actions', sortable: false },
      ],

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
      this.initialize();
    },
    computed: {
      ...get('institutions', ['listOfInstitutions']),
      ...sync('institutions', ['selectedInstitution']),
      ...sync('transfers', ['transferData']),
      ...sync('schedules', ['schedules', 'selSchedule']),
      ...get('users', ['loggedInUser']),
      ...get('reasons', ['reasons']),
      formEndorsementTitle() {
        return this.editEndorsementIndex === -1
          ? 'New Endorsement'
          : 'Edit Endorsement';
      },
    },
    watch: {
      selSchedule: {
        handler: 'getEndorsements',
        deep: true,
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
      ...call('transfers', ['deleteTransfer']),
      // Example of how to change name of method call
      //   new name       :  existing name
      // { DeleteSchedule: 'deleteSchedule' }

      ...call('transfers', ['saveForm']),
      ...call('app', ['SET_SNACKBAR']),
      async initialize() {
        this.endorsements = [];
        this.selSchedule = [];
        if (this.selectedInstitution) {
          await this.readSchedules({
            query: { origin: this.selectedInstitution.institutionName },
          });
        } else {
          this.schedules = [];
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
            console.log('searchOffender(): offender => ', offenderInfo.data[0]);
            //     if (
            //       this.somsOffender &&
            //       this.somsOffender.institutionName &&
            //       this.loggedInUser &&
            //       this.loggedInUser.somsinfo &&
            //       this.loggedInUser.somsinfo.organizationName &&
            //       this.somsOffender.institutionName !==
            //         this.loggedInUser.somsinfo.organizationName
            //     ) {
            //       throw Error('You do not belong to this institution');
            //     }
            this.editEndorsement.cdcrNumber = person.cdcrNumber;
            this.editEndorsement.firstName = person.firstName;
            this.editEndorsement.lastName = person.lastName;
            this.editEndorsement.ethnicity = person.ethnicity;
            this.editEndorsement.housing = person.housingArea;
            this.editEndorsement.securityLevel = person.securityLevel;
            this.editEndorsement.tbCode = person.tbCode;
            // this.editEndorsement.caseFactor = person.caseFactor;
            this.editEndorsement.currentEndorsementDate = person.endorseDate;
            setTimeout(() => {
              this.loading = false;
              this.displayOffender = true;
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
      setSnackbar(msg, result, timeout) {
        this.SET_SNACKBAR({
          top: true,
          center: true,
          message: msg,
          color: result,
          timeout: timeout,
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
      scheduleDelete(item) {
        console.log('scheduleDelete(): item => ', item);
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
        console.log('transferReasonSelected(): ', ctrl);
        if (ctrl) {
          this.editEndorsement.transferReasonCode = ctrl.reasonCode;
          this.editEndorsement.transferReasonDesc = ctrl.reasonDesc;
        }
      },
      async getEndorsements(newVal, oldVal) {
        console.log('getEndorsements(): newVal => ', newVal);
        console.log('getEndorsements(): oldVal => ', oldVal);
        function _getId(data) {
          return data && data[0] && data[0]._id ? data[0]._id : '';
        }
        try {
          const oldId = _getId(oldVal);
          const newId = _getId(newVal);
          if (newId && newId !== oldId) {
            let filter = {
              query: {
                scheduleId: newVal[0]._id,
              },
            };
            console.log('filter : ', filter);
            console.log('newVal', newVal);
            const response = await svcTransfers.find(filter);
            if (response.data && response.data.length) {
              this.endorsements = response.data;
            } else {
              this.endorsements = [];
            }
            // console.log(
            //   'getEndorsements(): this.endorsements => ',
            //   this.endorsements
            // );
          }
        } catch (error) {
          console.error('getEndorsements', error);
          this.setSnackbar(
            'Failed to fetch endorsements, try again later.',
            'error',
            3000
          );
        }
      },
      openEndorsement(item) {
        this.editEndorsement = Object.assign({}, item);
        this.selTransferReason = {
          reasonCode: this.editEndorsement.transferReasonCode,
          reasonDesc: this.editEndorsement.transferReasonDesc,
        };
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
        console.log('deleteEndorsement(): item => ', item);
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
        console.log(
          'saveEndorsement() this.editEndorsement => ',
          this.editEndorsement
        );

        // Assign the endorsement to the transferData object
        // And have saveForm save the transferData
        this.transferData = this.editEndorsement;

        try {
          await this.saveForm();
          this.setSnackbar('Success!', 'success', 3000);
          this.editEndorsement = Object.assign({}, this.defaultEndorsement);
          this.selTransferReason = null;

          await this.getEndorsements(this.selSchedule, []);
        } catch (ex) {
          console.error(ex);
          this.setSnackbar(`Failure!`, 'error', 3000);
          return false;
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
