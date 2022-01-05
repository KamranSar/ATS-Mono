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
                v-model="editSchedule.schedule"
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
            <v-col cols="2" sm="4" lg="2" align-self="baseline">
              <v-text-field
                label="Transfer Date"
                v-model="editSchedule.transferDate"
              ></v-text-field>
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
          <v-icon small class="mr-2" @click="openSchedule(item, schedules)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteSchedule(item, schedule._id)">
            mdi-delete
          </v-icon>
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
                v-model="editEndorsement.endorsementDate"
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
            <v-dialog v-model="dialogDeleteEndorsement" max-width="500px">
              <v-card>
                <v-card-title class="headline">
                  Are you sure you want to delete this inmate?
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="closeDeleteEndorsement"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="deleteEndorsementConfirm()"
                  >
                    Delete Inmate
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
          <v-icon
            small
            class="mr-2"
            @click="openEndorsement(item, endorsements)"
          >
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteEndorsement(item, endInmate._id)">
            mdi-delete
          </v-icon>
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

  export default {
    name: 'Schedules',

    data: () => ({
      loading: false,
      scheduleName: '',
      selDestination: '',
      selVias: '',
      transferDate: null,
      seats: 0,
      dialogSchedule: false,
      dialogDeleteSchedule: false,
      dialogEndorsement: false,
      dialogDeleteEndorsement: false,
      headersSchedule: [
        { text: 'Schedule', value: 'schedule' },
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
        destination: '',
        schedule: '',
        vias: [],
        transferDate: '',
        seats: 0,
      },
      defaultSchedule: {
        id: '',
        origin: '',
        destination: '',
        schedule: '',
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
        lastName: '',
        firstName: '',
        ethnicity: '',
        housing: '',
        securityLevel: '',
        tbCode: '',
        caseFactor: '',
        transferReason: {
          reasonCode: '',
          reasonDesc: '',
        },
        endorsementDate: '',
        // endorsementDetails: '',
      },
      defaultEndorsement: {
        cdcrNumber: '',
        lastName: '',
        firstName: '',
        ethnicity: '',
        housing: '',
        securityLevel: '',
        tbCode: '',
        caseFactor: '',
        transferReason: {
          reasonCode: '',
          reasonDesc: '',
        },
        endorsementDate: '',
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
      dialogSchedule(val) {
        val || this.closeSchedule();
      },
      dialogEndorsement(val) {
        val || this.closeEndorsement();
      },
      dialogDeleteSchedule(val) {
        val || this.closeScheduleDelete();
      },
      dialogDeleteEndorsement(val) {
        val || this.closeEndorsementDelete();
      },
    },
    methods: {
      ...call('schedules', [
        'createSchedule',
        'readSchedules',
        'readSchedulesByDate',
        'readSchedulesByOrigin',
        'updateSchedule',
        'deleteSchedule',
      ]),
      ...call('transfers', ['saveForm']),
      ...call('app', ['SET_SNACKBAR']),
      async getEndorsements(newVal, oldVal) {
        function _getId(data) {
          return data && data[0] && data[0]._id ? data[0]._id : '';
        }
        try {
          const oldId = _getId(oldVal);
          const newId = _getId(newVal);
          if (newId && newId !== oldId) {
            const response = await svcTransfers.find({
              query: {
                schedule: newVal[0].schedule,
              },
            });
            if (response.data && response.data.length) {
              this.endorsements = response.data;
            } else {
              this.endorsements = [];
            }
            console.log(
              'getEndorsements(): this.endorsements => ',
              this.endorsements
            );
          }
        } catch (error) {
          console.error('getEndorsements', error);
          this.SET_SNACKBAR({
            bottom: true,
            center: true,
            message: 'Failed to fetch endorsements, try again later.',
          });
        }
      },
      async initialize() {
        this.endorsements = [];
        this.selSchedule = [];
        if (this.selectedInstitution) {
          await this.readSchedules({
            query: { origin: this.selectedInstitution.institutionName },
          });
        }
      },
      openSchedule(schedule) {
        this.editSchedule = Object.assign({}, schedule);
      },
      deleteSchedule(schedule) {
        const index = this.schedules.indexOf(schedule);
        confirm('Are you sure you want to delete this schedule?') &&
          this.schedules.splice(index, 1);
      },
      deleteScheduleConfirm() {
        this.schedules.splice(this.editScheduleIndex, 1);
        this.closeScheduleDelete();
      },
      closeDeleteSchedule() {
        this.dialogDeleteSchedule = false;
        this.search = false;
        this.$nextTick(() => {
          this.editSchedule = Object.assign({}, this.defaultSchedule);
          this.editScheduleIndex = -1;
        });
      },
      closeScheduleDelete() {
        this.dialogScheduleDelete = false;
        this.$nextTick(() => {
          this.editSchedule = Object.assign({}, this.defaultSchedule);
          this.editScheduleIndex = -1;
        });
      },
      async saveSchedule() {
        const self = this;
        if (
          !self.selectedInstitution ||
          !self.editSchedule.schedule ||
          !self.editSchedule.destination ||
          !self.editSchedule.transferDate ||
          self.editSchedule.seats == 0
        ) {
          alert('A required field is empty.');
          return;
        }
        if (self.editSchedule._id) {
          await self.updateSchedule(self.editSchedule);
        } else {
          if (!self.editSchedule.origin) {
            self.editSchedule.origin = self.selectedInstitution.institutionName;
          }
          console.log('saveSchedule(): origin: ', self.editSchedule.origin);

          try {
            await self.createSchedule(self.editSchedule);
          } catch (e) {
            console.error(e);
          }
        }
        const dt = Date.now();
        console.log(dt);
        try {
          await self.readSchedulesByOrigin({
            institution: self.selectedInstitution.institutionName,
            // dateObj: {
            //   $gte: dt,
            // },
          });
          self.editSchedule = Object.assign({}, self.defaultSchedule);
        } catch (e) {
          console.error(e);
        }
        // this.closeSchedule();
      },
      openEndorsement(endInmate) {
        this.editEndorsementIndex = this.endorsements.indexOf(endInmate);
        this.editEndorsement = Object.assign({}, endInmate);
        this.dialogEndorsement = true;
      },
      deleteEndorsement(endInmate) {
        const index = this.endorsements.indexOf(endInmate);
        confirm('Are you sure you want to delete this Inmate?') &&
          this.endorsements.splice(index, 1);
      },
      deleteEndorsementConfirm() {
        this.endorsements.splice(this.editEndorsementIndex, 1);
        this.closeEndorsementDelete();
      },
      closeDeleteEndorsement() {
        this.dialogDeleteEndorsement = false;
        this.search = false;
        this.$nextTick(() => {
          this.editEndorsement = Object.assign({}, this.defaultEndorsement);
          this.editEndorsementIndex = -1;
        });
      },
      closeEndorsement() {
        this.dialogEndorsement = false;
        this.$nextTick(() => {
          this.editEndorsement = Object.assign({}, this.defaultEndorsement);
          this.editEndorsementIndex = -1;
        });
      },
      async saveEndorsement() {
        // debugger;
        console.log(
          'saveEndorsement() this.editEndorsement => ',
          this.editEndorsement
        );
        if (this.editEndorsementIndex > -1) {
          Object.assign(
            this.endorsements[this.editEndorsementIndex],
            this.editEndorsement
          );
        } else {
          this.endorsements.push(this.editEndorsement);
        }

        // Assign the endorsement to the transferData object
        // And have saveForm save the transferData
        this.transferData = this.editEndorsement;
        await this.saveForm();
        this.closeEndorsement();
      },
      closeEndorsementDelete() {
        this.dialogEndorsementDelete = false;
        this.$nextTick(() => {
          this.editEndorsement = Object.assign({}, this.defaultEndorsement);
          this.editEndorsementIndex = -1;
        });
      },
      goHome() {
        this.$router.push({
          name: 'Home',
        });
      },
      async getOffender() {
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
            this.editEndorsement.endorsementDate = person.endorseDate;
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
      transferReasonSelected(ctrl) {
        console.log('transferReasonSelected(): ', ctrl);
        // console.log(
        //   'transferReasonSelected(): this.selTransferReason.code => ',
        //   this.selTransferReason.reasonCode
        // );
        // console.log(
        //   'transferReasonSelected(): this.selTransferReason.desc => ',
        //   this.selTransferReason.reasonDesc
        // );

        // this.editEndorsement.transferReason.reasonCode =
        //   this.editEndorsement.transferReasonCode =
        //     this.selTransferReason.reasonCode;
        this.editEndorsement.transferReason.reasonCode =
          this.editEndorsement.transferReasonCode = ctrl.reasonCode;
        console.log(
          'transferReasonSelected(): this.editEndorsement.transferReason.reasonCode => ',
          this.editEndorsement.transferReason.reasonCode
        );
        // this.editEndorsement.transferReason.reasonDesc =
        //   this.editEndorsement.transferReasonDesc =
        //     this.selTransferReason.reasonDesc;
        this.editEndorsement.transferReason.reasonDesc =
          this.editEndorsement.transferReasonDesc = ctrl.reasonDesc;
        console.log(
          'transferReasonSelected(): this.editEndorsement.transferReason.reasonDesc => ',
          this.editEndorsement.transferReason.reasonDesc
        );
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
