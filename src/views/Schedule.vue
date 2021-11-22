<template>
  <div>
    <v-card elevation="3" class="ma-4 px-4 pb-4">
      <h1>Schedules</h1>
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        color="primary"
      ></v-progress-linear>
      <v-data-table
        :headers="headersSchedule"
        @click:row="rowClick"
        item-key="scheduleId"
        :items="schedules"
        single-select
        sort-by="destination"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <!-- <v-toolbar-title>FOLSOM STATE PRISON - Schedules</v-toolbar-title> -->
            <v-col cols="3" sm="8" lg="3">
              <v-autocomplete
                v-model="selectedInstitution"
                :disabled="loading"
                :items="listOfInstitutions"
                color="blue-grey lighten-2"
                label="Select an institution"
                item-text="institutionName"
                item-value="institutionName"
                prepend-icon="mdi-bank"
                clearable
                single-line
                class="pl-1"
              >
              </v-autocomplete>
            </v-col>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialogSchedule" max-width="800px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="secondary ma-2" v-bind="attrs" v-on="on">
                  Create Schedule
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formScheduleTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedSchedule.destination"
                          label="Destination"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedSchedule.schedule"
                          label="Schedule"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedSchedule.VIA"
                          :items="VIAs"
                          attach
                          chips
                          label="VIAs"
                          multiple
                        >
                        </v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedSchedule.transferDate"
                          label="Transfer Date"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedSchedule.seats"
                          label="Seats"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedSchedule.remainingSeats"
                          label="Remaining Seats"
                        ></v-text-field>
                      </v-col>
                      <!-- <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedSchedule.offenders" label="Offenders"></v-text-field>
                  </v-col> -->
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeSchedule"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="saveSchedule"
                    >Save</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDeleteSchedule" max-width="500px">
              <v-card>
                <v-card-title class="headline"
                  >Are you sure you want to delete this schedule?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDeleteSchedule"
                    >Cancel</v-btn
                  >
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="deleteScheduleConfirm()"
                    >Delete Schedule</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editSchedule(item, schedules)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteSchedule(item, schedule._id)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:item.print135="{ item }">
          <router-link to="">
            {{ item.print135 }}
            <v-icon color="primary" class="ml-5">mdi-file-document</v-icon>
          </router-link>
        </template>
        <template v-slot:no-data>
          <span>No Results</span>
        </template>
      </v-data-table>

      <!-- /* Endorsement Table Begin    */ -->
      <div id="endTable" v-show="isShowing">
        <div>
          <v-toolbar>
            <div class="flex-grow-1"></div>

            <v-toolbar-items>
              <!-- <v-btn  class="secondary ma-2" :bind="attrs" v-on="on">Print all 135</v-btn>
        <v-btn  class="secondary ma-2" :bind="attrs" v-on="on" @click="isShowing ^= true" >Close</v-btn>  -->
              <v-btn class="secondary ma-2">Print all 135</v-btn>
              <v-btn class="secondary ma-2" @click="isShowing ^= true">
                Close
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </div>
        <!-- <v-row class="my-4" no-gutters >
            <v-col  ><v-btn large class="secondary ma-2" v-bind="attrs" v-on="on"   >
              Print all 135
              </v-btn></v-col>
            <v-col  > <v-btn class="secondary ma-2" v-bind="attrs" v-on="on" @click="isShowing ^= true"  >
              Close
              </v-btn></v-col>
      
    </v-row> -->
        <v-data-table
          :headers="headersEndInmates"
          :items="endInmates"
          sort-by="lastName"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Endorsed Inmates</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialogEndInmate" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <!-- <v-btn large class="secondary ma-2" v-bind="attrs" v-on="on" >
              Print all 135
              </v-btn> -->

                  <v-btn class="secondary ma-2" v-bind="attrs" v-on="on">
                    Add New Endorsement
                  </v-btn>
                  <!-- <v-btn class="secondary ma-2" v-bind="attrs" v-on="on" @click="isShowing ^= true" >
              Close
              </v-btn> -->
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formEndInmateTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedEndInmate.cdcrNumber"
                            label="CDCR Number"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedEndInmate.lastName"
                            label="Last Name"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedEndInmate.firstName"
                            label="First Name"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedEndInmate.housing"
                            label="Housing"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedEndInmate.transferReason"
                            label="Transfer Reason"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedEndInmate.endorsementDate"
                            label="Endorsement Date"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            label="Endorsement Details"
                          ></v-text-field>
                        </v-col>
                        <!-- <template v-slot:item.print135="{ item }">
                <router-link to="">{{item.print135}}<v-icon color="primary" class="ml-5">mdi-file-document</v-icon></router-link>
              </template> -->
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeEndInmate">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="saveEndInmate">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDeleteEndInmate" max-width="500px">
                <v-card>
                  <v-card-title class="headline">
                    Are you sure you want to delete this inmate?
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="closeDeleteEndInmate"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="deleteEndInmateConfirm()"
                    >
                      Delete Inmate
                    </v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editEndInmate(item, endInmates)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteEndInmate(item, endInmate._id)">
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
      </div>
      <!-- /* Endorsement Table end    */ -->
    </v-card>
  </div>
</template>

<script>
  // import svcSchedule from '@/feathers/services/offender/details.service.js';
  import findAll from '@/feathers/helpers/findAll.js';

  export default {
    name: 'Schedules',

    data: () => ({
      loading: false,
      selectedInstitution: '',
      listOfInstitutions: [],
      selectedId: -1,
      isShowing: false,
      dialogSchedule: false,
      dialogDeleteSchedule: false,
      dialogEndInmate: false,
      dialogDeleteEndInmate: false,
      headersSchedule: [
        {
          text: 'Destination',
          align: 'start',
          sortable: false,
          value: 'destination',
        },
        { text: 'Schedule', value: 'schedule' },
        { text: 'VIA', value: 'VIA' },
        { text: 'Transfer Date', value: 'transferDate' },
        { text: 'Seats', value: 'seats' },
        { text: 'Remaining Seats', value: 'remainingSeats' },
        { text: 'Print-135', value: 'print135' },
        { text: 'Edit/Delete', value: 'actions', sortable: false },
      ],
      headersEndInmates: [
        {
          text: 'CDCR Number',
          align: 'start',
          sortable: false,
          value: 'cdcrNumber',
        },
        { text: 'Last Name', value: 'lastName' },
        { text: 'First Name', value: 'firstName' },
        { text: 'Housing', value: 'housing' },
        { text: 'Transfer Reason', value: 'transferReason' },
        { text: 'Endorsement Date', value: 'endorsementDate' },
        { text: 'Endorsement Details', value: 'endorsementDetails' },
        { text: 'Print', value: 'print' },
        { text: 'Edit/Delete', value: 'actions', sortable: false },
      ],

      VIAs: ['FOL-II', 'SAC-II', 'CSP-II', 'ASP-II', 'RJD-II', 'CMC-II'],

      schedules: [],
      editedScheduleIndex: -1,
      editedSchedule: {
        id: '',
        destination: '',
        schedule: '',
        VIA: '',
        transferDate: '',
        seats: 0,
        remainingSeats: 0,
      },
      defaultSchedule: {
        id: '',
        destination: '',
        schedule: '',
        VIA: '',
        transferDate: '',
        seats: 0,
        remainingSeats: 0,
      },

      endInmates: [],
      editedEndInmateIndex: -1,
      editedEndInmate: {
        cdcrNumber: '',
        lastName: '',
        firstName: '',
        housing: '',
        transferReason: '',
        endorsementDate: '',
        endorsementDetails: 0,
      },
      defaultEndInmate: {
        cdcrNumber: '',
        lastName: '',
        firstName: '',
        housing: '',
        transferReason: '',
        endorsementDate: '',
        endorsementDetails: 0,
      },
    }),

    computed: {
      formScheduleTitle() {
        return this.editedScheduleIndex === -1
          ? 'New Schedule'
          : 'Edit Schedule';
      },
      formEndInmateTitle() {
        return this.editedEndInmateIndex === -1
          ? 'New Endorsement'
          : 'Edit Endorsement';
      },
    },

    watch: {
      selInstitution(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          // Get Institution Schedules
          this.getSchedules();
        }
      },
      dialogSchedule(val) {
        val || this.closeSchedule();
      },
      dialogEndInmate(val) {
        val || this.closeEndInmate();
      },
      dialogDeleteSchedule(val) {
        val || this.closeScheduleDelete();
      },
      dialogDeleteEndInmate(val) {
        val || this.closeEndInmateDelete();
      },
    },

    created() {
      this.initialize();
    },

    async mounted() {
      await this.getInstitutions();
    },

    methods: {
      rowClick: function (item, row) {
        console.log('here');
        row.select(true);
        this.editedScheduleIndex = item.id;
        this.isShowing = true;
      },

      initialize() {
        (this.schedules = [
          {
            scheduleId: 1,
            destination: 'RJD',
            schedule: 'A',
            VIA: ['FOL-II', 'ASP-II'],
            transferDate: '05/07/2021',
            seats: 10,
            remainingSeats: 6,
          },
          {
            scheduleId: 2,
            destination: 'CCC',
            schedule: 'B',
            VIA: ['ASP-II', 'RJD-II'],
            transferDate: '06/07/2021',
            seats: 10,
            remainingSeats: 6,
          },
          {
            scheduleId: 3,
            destination: 'CIM',
            schedule: 'C',
            VIA: ['FOL-II', 'SAC-II'],
            transferDate: '07/07/2021',
            seats: 10,
            remainingSeats: 6,
          },
          {
            scheduleId: 4,
            destination: 'HDSP',
            schedule: 'D',
            VIA: ['FOL-II', 'CMC-II'],
            transferDate: '08/07/2021',
            seats: 10,
            remainingSeats: 6,
          },
        ]),
          (this.endInmates = [
            {
              endorsementId: 1,
              scheduleId: 1,
              cdcrNumber: 'E05980',
              lastName: 'Martin',
              firstName: 'David',
              housing: 'D0052',
              transferReason: 'Transfering from Folsom',
              endorsementDate: '12/2/21',
              endorsementDetails: 'Go to Transfer Record',
            },
            {
              endorsementId: 2,
              scheduleId: 1,
              cdcrNumber: 'AL7263',
              lastName: 'Harris',
              firstName: 'William',
              housing: 'ALAA3',
              transferReason: 'Housing',
              endorsementDate: '12/2/21',
              endorsementDetails: 'Go to Transfer Record',
            },
            {
              endorsementId: 3,
              scheduleId: 1,
              cdcrNumber: 'AB1234',
              lastName: 'Doe',
              firstName: 'John',
              housing: 'IU-2656',
              transferReason: 'Transfering from Folsom',
              endorsementDate: '12/2/21',
              endorsementDetails: 'Go to Transfer Record',
            },
          ]);
      },

      /**
       * getInstitutions function
       * @returns - All the institutions if you are the default admin role, otherwise it grabs your logged in institution
       */
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
          return this.listOfInstitutions;
        } catch (error) {
          console.error('getInstitutions: ', error);
          this.listOfInstitutions = [];
          return [];
        } finally {
          this.loading = false;
        }
      },

      getSchedules() {
        // Read Schedules db for Selected Institution
        this.loading = true;
        try {
          // const query = {
          //   query: {
          //     institutionName: this.selectedInstitution,
          //   },
          // };

          // const scheduleInfo = await svcSchedule.find(query);

          // console.log('getSchedules(): scheduleInfo => ' + scheduleInfo);
          // if (scheduleInfo.data.length > 0) {
          setTimeout(() => {
            this.loading = false;
          }, 200);
          alert('getSchedules() completed successfully!');
          // }
        } catch (error) {
          this.loading = false;
          if (error.code == 500) {
            // this.searchOffenderNotFoundErrorDialog = true;
          } else {
            // Display a message that an error occurred!!!
          }
        }
      },

      editSchedule(schedule) {
        this.editedScheduleIndex = this.schedules.indexOf(schedule);
        this.editedSchedule = Object.assign({}, schedule);
        this.dialogSchedule = true;
      },

      editEndInmate(endInmate) {
        this.editedEndInmateIndex = this.endInmates.indexOf(endInmate);
        this.editedEndInmate = Object.assign({}, endInmate);
        this.dialogEndInmate = true;
      },

      deleteSchedule(schedule) {
        const index = this.schedules.indexOf(schedule);
        confirm('Are you sure you want to delete this schedule?') &&
          this.schedules.splice(index, 1);
      },
      deleteEndInmate(endInmate) {
        const index = this.endInmates.indexOf(endInmate);
        confirm('Are you sure you want to delete this Inmate?') &&
          this.endInmates.splice(index, 1);
      },

      closeSchedule() {
        this.dialogSchedule = false;
        this.$nextTick(() => {
          this.editedSchedule = Object.assign({}, this.defaultSchedule);
          this.editedScheduleIndex = -1;
        });
      },

      closeEndInmate() {
        this.dialogEndInmate = false;
        this.$nextTick(() => {
          this.editedEndInmate = Object.assign({}, this.defaultEndInmate);
          this.editedEndInmateIndex = -1;
        });
      },

      closeDeleteSchedule() {
        this.dialogDeleteSchedule = false;
        this.search = false;
        this.$nextTick(() => {
          this.editedSchedule = Object.assign({}, this.defaultSchedule);
          this.editedScheduleIndex = -1;
        });
      },

      closeDeleteEndInmate() {
        this.dialogDeleteEndInmate = false;
        this.search = false;
        this.$nextTick(() => {
          this.editedEndInmate = Object.assign({}, this.defaultEndInmate);
          this.editedEndInmateIndex = -1;
        });
      },

      saveSchedule() {
        if (this.editedScheduleIndex > -1) {
          Object.assign(
            this.schedules[this.editedScheudleIndex],
            this.editedSchedule
          );
        } else {
          this.schedules.push(this.editedSchedule);
        }
        // Save to the database

        this.closeSchedule();
      },

      saveEndInmate() {
        if (this.editedEndInmateIndex > -1) {
          Object.assign(
            this.endInmates[this.editedEndInmateIndex],
            this.editedEndInmate
          );
        } else {
          this.EndInmates.push(this.editedEndInmate);
        }
        this.closeEndInmate();
      },

      deleteScheduleConfirm() {
        this.schedules.splice(this.editedScheduleIndex, 1);
        this.closeScheduleDelete();
      },
      deleteEndInmateConfirm() {
        this.endInmates.splice(this.editedEndInmateIndex, 1);
        this.closeEndInmateDelete();
      },
      closeScheduleDelete() {
        this.dialogScheduleDelete = false;
        this.$nextTick(() => {
          this.editedSchedule = Object.assign({}, this.defaultSchedule);
          this.editedScheduleIndex = -1;
        });
      },
      closeEndInmateDelete() {
        this.dialogEndInmateDelete = false;
        this.$nextTick(() => {
          this.editedEndInmate = Object.assign({}, this.defaultEndInmate);
          this.editedEndInmateIndex = -1;
        });
      },
    },
    /* Schedule Script End    */
  };
</script>

<style>
  tr.v-data-table__selected {
    background: #7d92f5 !important;
  }
</style>
