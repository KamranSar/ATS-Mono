/* eslint-disable no-unused-vars */
<template>
  <v-card flat class="mb-12">
    <v-card-title class="blue-grey lighten-4">
      <v-row>
        <v-col cols="4" xs="12" md="4" class="py-1" align-self="center">
          <h2>Reports</h2>
        </v-col>
        <v-col
          cols="4"
          xs="12"
          md="4"
          class="py-1 colOutline"
          align-self="center"
        >
          <InstitutionDropdown />
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
    <v-card flat class="my-4">
      <v-row class="mx-2">
        <v-col cols="12" sm="6" lg="3">
          <v-card class="blue-grey lighten-4" min-width="200px" height="100%">
            <v-card-title style="line-height: 1rem">
              <v-row>
                <v-col>
                  <span class="title">Bus Order Seat Request</span>
                </v-col>
              </v-row>
            </v-card-title>

            <v-row no-gutters class="px-4">
              <v-col cols="12">
                <DateRangePicker
                  label="Endorsed Date Range"
                  v-model="dateEndorsed"
                />
              </v-col>
            </v-row>

            <v-row no-gutters class="px-4" justify="space-between">
              <v-col cols="10">
                <v-select
                  dense
                  label="Endorsed To"
                  placeholder="Endorsed To"
                  :items="listOfInstitutions"
                  item-text="institutionName"
                  item-value="institutionId"
                  v-model="selEndorsedTo"
                  class="vselectTxtColor"
                  clearable
                >
                  <template v-slot:item="{ item, on, attrs }">
                    <v-list-item dense v-on="on" v-bind="attrs">
                      <v-list-item-title>{{
                        `${item.institutionId} - ${item.institutionName}`
                      }}</v-list-item-title>
                    </v-list-item>
                  </template></v-select
                >
              </v-col>
              <v-col cols="auto">
                <v-btn icon large @click="createBusOrderSeat">
                  <v-icon large color="primary"> mdi-file-document </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row no-gutters class="px-4 mb-4">
              <v-col>
                <v-checkbox
                  v-model="includeScheduled"
                  label="Include Scheduled Offenders"
                  color="success"
                  hide-details
                  dense
                ></v-checkbox>
              </v-col>
            </v-row>
            <v-row no-gutters class="px-4">
              <v-col cols="auto">
                <DateRangePicker
                  label="Arrival Date Range"
                  v-model="arrivalDate"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-card class="blue-grey lighten-4" min-width="200px" height="100%">
            <v-card-title style="line-height: 1rem">
              <v-row>
                <v-col>
                  <span class="title">Transfer Record</span>
                  <br />
                  <span style="font-size: 12px">CDCR-135</span>
                </v-col>
              </v-row>
            </v-card-title>
            <v-row no-gutters>
              <v-col cols="6" class="mx-4">
                <v-select
                  label="Schedule"
                  v-model="selSchedule"
                  :items="schedules"
                  item-text="title"
                  item-value="_id"
                  return-object
                  class="my-2 pl-1"
                  clearable
                  hide-details="true"
                  dense
                >
                  <template v-slot:item="{ item }">
                    {{ item.title }} --- {{ item.transferDate }} ---
                    {{ item.destination }}
                  </template>
                </v-select>
              </v-col>
              <v-col cols="1" class="mx-4">
                <v-icon large color="primary" @click="print135BySchedule()">
                  mdi-file-document
                </v-icon>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="6" class="mx-4">
                <v-text-field
                  label="By CDCR #"
                  v-model="cdcrNum"
                  dense
                  @change="onToUpperCase(cdcrNum)"
                  @keyup="onToUpperCase(cdcrNum)"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="1" class="mx-4">
                <v-icon large color="primary" @click="print135ByCdcrNumber()">
                  mdi-file-document
                </v-icon>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-card class="blue-grey lighten-4" min-width="200px" height="100%">
            <v-card-title style="line-height: 1rem">
              <v-row>
                <v-col>
                  <span class="title">Advance Transfer Notice</span>
                  <br />
                  <span style="font-size: 12px">CDCR-7344</span>
                </v-col>
              </v-row>
            </v-card-title>
            <v-row no-gutters>
              <v-col cols="6" class="mx-4">
                <v-menu
                  v-model="dateBeginMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      label="Begin"
                      prepend-inner-icon="mdi-calendar"
                      v-bind="attrs"
                      v-on="on"
                      placeholder=" "
                      v-model="dateBegin"
                      clearable
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dateBegin"
                    @input="dateBeginMenu = false"
                    clearable
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="1" class="mx-4">
                <v-icon
                  large
                  color="primary"
                  @click="create7344(selectedInstitution, dateBegin, dateEnd)"
                >
                  mdi-file-document
                </v-icon>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="6" class="mx-4">
                <v-menu
                  v-model="dateEndMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      label="End"
                      prepend-inner-icon="mdi-calendar"
                      v-bind="attrs"
                      v-on="on"
                      placeholder=" "
                      v-model="dateEnd"
                      clearable
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dateEnd"
                    @input="dateEndMenu = false"
                    clearable
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="1" class="mx-4"> </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-card class="blue-grey lighten-4" min-width="200px" height="100%">
            <v-card-title style="line-height: 1rem">
              <v-row>
                <v-col>
                  <span class="title">Transfer Check Sheet</span>
                  <br />
                  <span style="font-size: 12px">CDCR-134</span>
                </v-col>
              </v-row>
            </v-card-title>
            <v-row no-gutters>
              <v-col cols="6" class="mx-4">
                <v-select
                  label="Schedule"
                  v-model="selSchedule"
                  :items="schedules"
                  item-text="title"
                  item-value="_id"
                  return-object
                  class="my-2 pl-1"
                  clearable
                  hide-details="true"
                  dense
                >
                  <template v-slot:item="{ item }">
                    {{ item.title }} --- {{ item.transferDate }} ---
                    {{ item.destination }}
                  </template>
                </v-select>
              </v-col>
              <v-col cols="1" class="mx-4">
                <v-icon large color="primary" @click="print134">
                  mdi-file-document
                </v-icon>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <BusSeatReportCard />
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
  import DateRangePicker from '@/components/util/DateRangePicker.vue';
  import InstitutionDropdown from '@/components/util/InstitutionDropdown.vue';
  import { get, sync, call } from 'vuex-pathify';
  import pdfMake from 'pdfmake/build/pdfmake';
  import pdfFonts from 'pdfmake/build/vfs_fonts';
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  import createBusOrderSeat from '@/pdfs/createBusOrderSeat.js';
  import BackToHome from '@/components/util/BackToHome.vue';
  import BusSeatReportCard from '@/components/Reports/BusSeatReportCard.vue';
  import create135 from '@/pdfs/create135.js';
  import create7344 from '@/pdfs/create7344.js';
  import create134 from '@/pdfs/create134.js';
  import svcSchedules from '@/feathers/services/schedule/schedule.service.js';
  import onToUpperCase from '@/helpers/onToUpperCase.js';
  export default {
    name: 'Reports',
    components: {
      DateRangePicker,
      InstitutionDropdown,
      BackToHome,
      BusSeatReportCard,
    },
    data: (vm) => ({
      includeScheduled: false,
      arrivalDateMenu: false,
      arrivalDate: [null, null],
      schedule: [],
      stateOf: 'STATE OF CALIFORNIA',
      agency: 'DEPARTMENT OF CORRECTIONS AND REHABILITATION',
      report135: 'CDCR 135 (Rev. 03/06)',
      report134: 'CDCR 134 (Rev. 03/06)',
      report7344: 'CDCR FORM 7344 (XX/XX)',
      pdfHeaderRow: [],
      pdfData: [],
      cdcrNum: '',
      sel135Schedule: '',
      sel134Schedule: '',
      selEndorsedTo: '',
      dateEndorsed: [null, null],
      dateEndorsedMenu: false,
      dateBeginMenu: false,
      dateBegin: '',
      dpBegin: '',
      dateEndMenu: false,
      dateEnd: '',
      dpEnd: '',
      minDate: vm.getMinDate(),
      maxDate: new Date().toISOString().substr(0, 10),
      n7334Transferring: 0,
    }),
    computed: {
      ...sync('transfers', ['transfers']),
      ...sync('schedules', ['schedules', 'selSchedule']),
      ...get('institutions', ['selectedInstitution', 'listOfInstitutions']),
      ...get('users', ['loggedInUser']),
      ...get('app', ['loading']),
    },
    async mounted() {
      await this.readSchedulesByInstitution();
    },
    methods: {
      ...call('app', ['SET_SNACKBAR']),
      ...call('schedules', [
        'readSchedules',
        'readSchedulesByDate',
        'readSchedulesByOrigin',
      ]),
      ...call('transfers', [
        'readTransfers',
        'readOffenderDetails',
        'readTransfersByDate',
        'readTransfersByInstitution',
        'readTransfersBySchedule',
      ]),
      ...call('institutions', ['getInstitutionIdByOrigin']),
      onToUpperCase,
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
      // getMinDate()
      // sets the min date for DatePicker
      // to 540 days (1.5 years) prior to today
      getMinDate() {
        let d = new Date();
        d.setDate(d.getDate() - 540);
        d.setDate(1);
        this.minDate = d;
        return d.toISOString().substr(0, 10);
      },

      // readSchedulesByInstitution
      // Retrieves the schedules based on
      // the institution selected
      async readSchedulesByInstitution() {
        let filter = {};
        if (this.selectedInstitution) {
          filter = {
            query: {
              origin: this.selectedInstitution.institutionName,
            },
          };
        }
        await this.readSchedules(filter);
      },

      // ****************************************
      // Methods to create PDF documents
      //
      // ****************************************
      async print135BySchedule() {
        if (!this.selSchedule || !this.selSchedule._id) {
          this.setSnackbar('Please select a schedule before printing');
          return;
        }
        const filter = {
          query: {
            $limit: 50,
            $sort: {
              transferDate: 1,
            },
            scheduleId: this.selSchedule._id,
          },
        };
        this.transfers = await this.readTransfers(filter);
        await create135(this.selSchedule, this.transfers);
      },
      async print135ByCdcrNumber() {
        if (!this.cdcrNum) {
          this.setSnackbar('Please enter a cdcr number to print by CDCR#');
          return;
        }

        let filter = {
          query: {
            $limit: 50,
            $sort: {
              transferDate: 1,
            },
          },
        };
        filter.query.cdcrNumber = this.cdcrNum;
        this.transfers = await this.readTransfers(filter);

        if (!this.transfers.length) {
          this.setSnackbar(`${this.cdcrNum} is not on any schedule`);
          return;
        }

        const schedule = await svcSchedules.get(this.transfers[0].scheduleId);
        if (schedule) await create135(schedule, this.transfers);
      },
      async print134() {
        // Get transfer for selected schedule
        // console.log('create134(): this.selSchedule => ', this.selSchedule);
        if (!this.selSchedule || !this.selSchedule._id) {
          this.setSnackbar(
            'Schedule not selected. Please select a schedule and try again.'
          );
          return;
        }
        let filter = {
          query: {
            $limit: 50,
            $sort: {
              lastName: 1,
            },
            scheduleId: this.selSchedule._id,
          },
        };

        try {
          this.transfers = await this.readTransfers(filter);
          // console.log('build134Data(): transfers => ', this.transfers);
          await create134(this.selSchedule, this.transfers);
          if (!this.transfers) {
            alert('No Transfers found for schedule: ', this.selSchedule.title);
            return;
          }
        } catch (ex) {
          console.error('build134Data() exception: ', ex);
        }
      },
      create7344,
      createBusOrderSeat() {
        createBusOrderSeat({
          dateEndorsed: this.dateEndorsed,
          selEndorsedTo: this.selEndorsedTo,
          includeScheduled: this.includeScheduled,
          arrivalDate: this.arrivalDate,
          selectedInstitution: this.selectedInstitution,
        });
      },
    },
    watch: {
      selectedInstitution: {
        deep: true,
        handler: 'readSchedulesByInstitution',
      },
    },
  };
</script>

<style scoped>
  .title {
    word-break: keep-all;
    line-height: 0.8;
  }

  .colOutline {
    background-color: white;
    border-radius: 5px;
  }
</style>
