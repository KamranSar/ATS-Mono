<template>
  <v-card class="mb-12">
    <v-card-title class="blue-grey lighten-4">
      <v-row>
        <v-col cols="4" xs="12" md="4" class="py-1" align-self="center">
          <h2>Reports</h2>
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
    <v-card class="my-4">
      <v-row class="mx-2">
        <v-col cols="12" sm="6" lg="3">
          <v-card class="blue-grey lighten-4" min-width="200px" height="100%">
            <v-card-title style="line-height: 1rem">
              <v-row>
                <v-col>
                  <span style="white-space: nowrap">Transfer Record</span>
                  <br />
                  <span style="font-size: 12px">CDCR-135</span>
                </v-col>
              </v-row>
            </v-card-title>
            <v-row no-gutters>
              <v-col cols="6" class="mx-4">
                <v-select
                  label="By Schedule"
                  placeholder="Schedule"
                  :items="schedules"
                  item-text="schedule"
                  item-value="schedule"
                  v-model="sel135Schedule"
                  class="vselectTxtColor"
                  dense
                  @change="onChangeSchedule"
                ></v-select>
              </v-col>
              <v-col cols="1" class="mx-4">
                <v-icon large color="primary" @click="create135('schedule')">
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
                ></v-text-field>
              </v-col>
              <v-col cols="1" class="mx-4">
                <v-icon large color="primary" @click="create135('cdcrNumber')">
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
                  <span style="white-space: nowrap">Advance Transfer </span>
                  <span style="white-space: nowrap">Notice</span>
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
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dateBegin"
                    @input="dateBeginMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="1" class="mx-4">
                <v-icon large color="primary" @click="create7344">
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
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dateEnd"
                    @input="dateEndMenu = false"
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
                  <span style="white-space: nowrap">Transfer Check Sheet</span>
                  <!-- <span style="white-space: nowrap">Sheet</span> -->
                  <br />
                  <span style="font-size: 12px">CDCR-134</span>
                </v-col>
              </v-row>
            </v-card-title>
            <v-row no-gutters>
              <v-col cols="6" class="mx-4">
                <v-select
                  label="By Schedule"
                  placeholder="Schedule"
                  :items="schedules"
                  item-text="schedule"
                  item-value="schedule"
                  v-model="sel134Schedule"
                  class="vselectTxtColor"
                  dense
                  @change="onChangeSchedule"
                ></v-select>
              </v-col>
              <v-col cols="1" class="mx-4">
                <v-icon large color="primary" @click="create134">
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
                  <span style="white-space: nowrap">Bus Seat Report</span>
                  <br />
                  <!-- Line below is colored the same as background to hide text & to make things line up -->
                  <span style="font-size: 12px; color: #cfd8dc">.</span>
                </v-col>
              </v-row>
            </v-card-title>
            <v-row no-gutters>
              <v-col cols="6" class="mx-4">
                <v-select
                  label="Endorsed To"
                  placeholder="Endorsed To"
                  :items="listOfInstitutions"
                  item-text="institutionId"
                  item-value="institutionId"
                  v-model="selEndorsedTo"
                  class="vselectTxtColor"
                  dense
                ></v-select>
              </v-col>
              <v-col cols="1" class="mx-4">
                <v-icon large color="primary" @click="createBusSeatPDF">
                  mdi-file-document
                </v-icon>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
  // import findAll from '@/feathers/helpers/findAll.js';
  import { get, sync, call } from 'vuex-pathify';
  import pdfMake from 'pdfmake/build/pdfmake';
  import pdfFonts from 'pdfmake/build/vfs_fonts';
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  import departuresArrivalsSvc from '@/feathers/services/departuresarrivals/departuresarrivals.service.js';

  export default {
    name: 'Reports',
    data: (vm) => ({
      loading: false,
      records: null,
      // selectedInstitution: '',
      // listOfInstitutions: [],
      schedule: [],
      fileName: 'test',
      stateOf: 'STATE OF CALIFORNIA',
      agency: 'DEPARTMENT OF CORRECTIONS AND REHABILITATION',
      report135: 'CDCR 135 (Rev. 03/06)',
      report134: 'CDCR 134 (Rev. 03/06)',
      report7344: 'CDCR FORM 7344 (XX/XX)',
      pdfHeaderRow: [],
      pdfData: [],
      // Textbbxes, dropdowns, etc.
      openPanel: null,
      chbx135CDCRNum: false,
      show135CDCRNum: true,
      cdcrNum: '',
      chbx135Schedule: false,
      show135Schedules: true,
      sel135Schedule: '',
      sel134Schedule: '',
      itemsSchedules: ['Schedule K', 'Schedule L', 'Schedule F'],
      selEndorsedTo: '',
      itemsEndorsedTo: ['Endorse 1', 'Endorse 2', 'Endorse 3'],
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
      ...sync('schedules', ['schedules']),
      ...sync('institutions', ['selectedInstitution']),
      ...get('institutions', ['listOfInstitutions']),
      ...get('users', ['loggedInUser']),
    },
    async mounted() {
      // await this.getInstitutions();
      if (
        this.loggedInUser &&
        this.loggedInUser.somsinfo &&
        this.loggedInUser.somsinfo.organizationName
      ) {
        this.selectedInstitution = this.loggedInUser.somsinfo.organizationName;
        console.log('selectedInstitution: ', this.selectedInstitution);
      }
      await this.getSchedulesByInstitution();
    },
    methods: {
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

      goHome() {
        this.$router.push({
          name: 'Home',
        });
      },
      async getSchedulesByInstitution() {
        this.loading = true;
        console.log(
          'getSchedulesByInstitution(): selectedInstitution => ',
          this.selectedInstitution
        );
        try {
          if (this.selectedInstitution) {
            const response = await this.readSchedulesByOrigin({
              institution: this.selectedInstitution,
            });
            if (response) {
              this.schedules = response.data;
            }
          }
        } catch (e) {
          console.log('getSchedulesByInstitution(): ERROR => ', e);
          this.schedules = [];
        } finally {
          this.loading = false;
        }
      },

      onChangeSchedule(e) {
        for (let s of this.schedules) {
          if (s.schedule === e) {
            this.schedule = s;
            break;
          }
        }
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

      // writeRotatedText(text)
      // define your function for generating rotated text
      writeRotatedText(text) {
        let ctx,
          canvas = document.createElement('canvas');
        // I am using predefined dimensions so either make this part of the arguments or change at will
        canvas.width = 36;
        canvas.height = 720;
        // canvas.style = 'border: 1px solid red;';
        ctx = canvas.getContext('2d');
        ctx.font = '36pt Arial';
        // ctx.style = 'border: 1px solid red;';
        ctx.save();
        ctx.translate(36, 720);
        ctx.rotate(-0.5 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fillText(text, 0, 0);
        ctx.restore();
        return canvas.toDataURL();
      },

      // get135()
      //
      async create135(param) {
        let filter = {
          query: {
            $limit: 50,
            $sort: {
              transferDate: 1,
            },
          },
        };

        if (param == 'schedule' && this.sel135Schedule) {
          filter.query.schedule = this.sel135Schedule;
          // if (!this.schedule) {
          //   alert('Selected schedule = ', this.schedule);
          //   return;
          // }
          // this.readTransfersBySchedule(filter);
        } else if (param == 'cdcrNumber' && this.cdcrNum) {
          let today = new Date().toISOString().split('T')[0];
          filter.query.cdcrNumber = this.cdcrNum;
          filter.query.transferDate = { $gte: today };
          // this.readTransfersBySchedule(filter);
        } else {
          alert('Invalid option for CDCR-135 Transfer Record.');
          return;
        }

        try {
          this.transfers = await this.readTransfers(filter);
          console.log('create135(): transfers => ', this.transfers);
          if (!this.transfers) {
            alert('No Transfers found for schedule: ', this.schedule.schedule);
            return;
          }
        } catch (ex) {
          console.error('create135() exception: ', ex);
        }

        let data = [];
        // let row = [];
        const obj = {
          text: '',
          style: 'tblCenter',
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
          obj.text = xfr.cdcr135Comments;
          row.push(Object.assign({}, obj));

          data.push(row);
        }

        console.log('create135(): data => ', data);
        if (data) {
          this.create135PDF(data);
        } else {
          // error message
          alert('Could not create CDCR 135 PDF Document!');
        }
      },

      // create135PDF()
      //
      create135PDF(data) {
        const fileName = this.fileName + '.pdf';

        let doc =
          this.stateOf +
          '\n' +
          this.report135 +
          '\nDISTRIBUTION PER INSTITUTION POLICY';
        let title = 'TRANSFER RECORD';
        let agency = this.agency;

        let dtLabel =
          'The following identified persons will be transferred this date';
        let xfrNum = this.schedules.length;
        let scheduleName = this.schedules[0].schedule;
        let from = this.schedules[0].destination;
        let to = this.schedules[0].origin;
        let vias = this.schedules[0].vias;
        let xfrDate = this.schedules[0].transferDate;

        let dd = {
          pageSize: 'LETTER',
          pageMargins: [10, 10, 10, 16],
          borders: [true, true, true, true],
          footer: function (currentPage, pageCount) {
            let footer = {
              text: currentPage.toString() + ' of ' + pageCount,
              fontSize: 9,
              alignment: 'center',
            };
            return footer;
          },

          content: [
            {
              style: '',
              table: {
                headerRows: 4,
                // dontBreakRows: true,
                //keepWithHeaderRows: 1,
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
                      text: title,
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
                              text: 'SCHEDULE:  ' + scheduleName,
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
                  // Row 4 - Main Table
                  [
                    {
                      layout: 'lightHorizontalLines',
                      table: {
                        widths: [
                          'auto',
                          'auto',
                          '*',
                          'auto',
                          'auto',
                          'auto',
                          'auto',
                          'auto',
                          'auto',
                          'auto',
                        ],
                        body: [
                          [
                            { text: '#', style: 'tableHeader' },
                            { text: 'CDCR Number', style: 'tableHeader' },
                            { text: 'Name', style: 'tableHeader' },
                            { text: 'Level', style: 'tableHeader' },
                            { text: 'Housing', style: 'tableHeader' },
                            { text: 'TB Cd', style: 'tableHeader' },
                            { text: 'Ethnic', style: 'tableHeader' },
                            { text: 'Case Factor', style: 'tableHeader' },
                            {
                              text: 'Specific Transfer Reason',
                              style: 'tableHeader',
                            },
                            { text: 'Comments', style: 'tableHeader' },
                          ],
                          ...data,
                        ],
                      },
                      colSpan: 3,
                    },
                    {},
                    {},
                  ],
                  // Row 5 - Footer Row 1
                  [
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
                    {
                      text: 'Receipt of the above-name persons and their records is acknowledged',
                      fontSize: 8,
                      alignment: 'center',
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
                  // [
                  //   {
                  //     text: function(currentPage, pageCount) {return currentPage.toString() + " of " + pageCount;},
                  //     alignment: "right",
                  //     style: "hdrSchedule",
                  //     colSpan: 3,
                  //   },
                  //   {},
                  //   {},
                  // ],
                ],
                border: [true, true, true, true],
              },
            },
          ],
          styles: {
            hdrLeft: {
              bold: true,
              fontSize: 7,
            },
            tblCenter: {
              alignment: 'center',
              bold: true,
              fontSize: 10,
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
            tableHeader: {
              bold: true,
              fontSize: 8,
              color: 'black',
            },
          },
        };

        console.log('create135PDF(): dd => ', dd);
        pdfMake.createPdf(dd).download(fileName);
        // alert("create135PDF() Done!");
      },

      // create134()
      // Called by button clicked
      // Builds data for 134 report
      // Calls create134PDF(data) to generate PDF report file
      //
      async create134() {
        // Get transfer for selected schedule
        let filter = {
          query: {
            $limit: 50,
            $sort: {
              lastName: 1,
            },
            schedule: this.schedule.schedule,
          },
        };

        try {
          this.transfers = await this.readTransfers(filter);
          console.log('build134Data(): transfers => ', this.transfers);
          if (!this.transfers) {
            alert('No Transfers found for schedule: ', this.schedule.schedule);
            return;
          }
        } catch (ex) {
          console.error('build134Data() exception: ', ex);
        }

        let data = [];
        let row = [];
        let obj = [];
        for (let xfr of this.transfers) {
          // Column 1 - CDCR Number
          obj = {
            text: xfr.cdcrNumber,
            style: 'tblLeft',
          };
          row.push(Object.assign({}, obj));
          // Column 2 - Last Name, First Name - colspan = 2
          obj = {
            text: xfr.lastName + ', ' + xfr.firstName,
            style: 'tblLeft',
            colSpan: 2,
          };
          row.push(Object.assign({}, obj));
          // Column 3 - Empty cell
          obj = { text: ' ', style: 'tblCenter' };
          row.push(Object.assign({}, obj));
          // Column 4 - Discharge Date
          obj = {
            text: new Date(xfr.transferDate).toISOString().split('T')[0], // FIXME Replace with Release Date
            style: 'tblLeft',
          };
          row.push(Object.assign({}, obj));
          // Column 5 - 20 Empty cell
          for (let i = 5; i < 21; i++) {
            obj = { text: ' ', style: 'tblCenter' };
            row.push(Object.assign({}, obj));
          }

          data.push(row);
          row = [];
        }
        // Fill empty rows to max 24 per page

        console.log('create134(): data => ', data);
        if (data) {
          this.create134PDF(data);
        } else {
          // error message
          alert('Could not create CDCR 134 PDF Document!');
        }
      },
      create134PDF(data) {
        const fileName = this.fileName + '.pdf';

        let title = 'RECORDS TRANSFER CHECK SHEET';
        let txtOriginal = 'Original-Receiving Facility/Region Records';
        let txtCopy = 'Copy-Sending Facility/Region Records';

        let txtDate = this.schedule.transferDate;
        let nXfer = this.transfers.length;

        let from = this.schedule.origin;
        let to = this.schedule.destination;
        let vias = this.schedule.vias;

        let dd = {
          pageSize: 'LETTER',
          pageMargins: [10, 10, 10, 10],
          borders: [true, true, true, true],

          content: [
            // =============================
            // State, Agency
            // =============================
            {
              columns: [
                {
                  text: 'STATE OF CALIFORNIA',
                  style: 'hdrLeft',
                },
                {
                  text: this.agency,
                  style: 'hdrRight',
                },
              ],
            },
            // =============================
            // State, Agency
            // =============================
            {
              columns: [
                {
                  text: title + '\n' + this.report134,
                  style: 'hdrLeft',
                },
                {
                  text: txtOriginal + '\n' + txtCopy,
                  style: 'hdrCopies',
                },
              ],
            },
            // =============================
            // Table Data
            // =============================
            {
              layout: {
                // eslint-disable-next-line
                fillColor: function (rowIndex, node, columnIndex) {
                  if (rowIndex < 4) {
                    return null;
                  }
                  return rowIndex % 2 === 0 ? '#F0F0F0' : null;
                },
              },
              table: {
                headerRows: 4,
                widths: [
                  '*',
                  'auto',
                  '*',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                  'auto',
                ],
                body: [
                  [
                    {
                      text: 'DATE:  ' + txtDate,
                      style: 'hdrSchedule',
                      margin: [2, 8, 2, 20],
                      colSpan: 2,
                    },
                    {}, // Empty columns for alignment purposes
                    {
                      text: 'NUMBER TRANSFERRING:  ' + nXfer,
                      style: 'hdrSchedule',
                      margin: [2, 8, 2, 20],
                      colSpan: 2,
                    },
                    {}, // Empty columns for alignment purposes
                    {
                      image: this.writeRotatedText('Central File'),
                      fit: [7, 303],
                      alignment: 'center',
                      margin: [2, 20, 2, 2],
                      rowSpan: 4,
                    },
                    {
                      image: this.writeRotatedText(
                        'Slough File / Lifer Packets'
                      ),
                      fit: [7, 303],
                      style: 'hdrLeft',
                      margin: [2, 20, 2, 2],
                      rowSpan: 4,
                    },
                    {
                      image: this.writeRotatedText('Photos & Negatives'),
                      fit: [7, 303],
                      style: 'hdrLeft',
                      margin: [2, 20, 2, 2],
                      rowSpan: 4,
                    },
                    {
                      image: this.writeRotatedText(
                        'Discharge File / Microfiche'
                      ),
                      fit: [7, 303],
                      style: 'hdrLeft',
                      margin: [2, 20, 2, 2],
                      rowSpan: 4,
                    },
                    {
                      image: this.writeRotatedText('CDCR 1066 Outcard'),
                      fit: [7, 303],
                      style: 'hdrLeft',
                      margin: [2, 20, 2, 2],
                      rowSpan: 4,
                    },
                    {
                      image: this.writeRotatedText(
                        'CDCR 114-A Isolation Seg File'
                      ),
                      fit: [7, 303],
                      style: 'hdrLeft',
                      margin: [2, 20, 2, 2],
                      rowSpan: 4,
                    },
                    {
                      image: this.writeRotatedText('Visiting Records'),
                      fit: [7, 303],
                      style: 'hdrLeft',
                      margin: [2, 20, 2, 2],
                      rowSpan: 4,
                    },
                    {
                      image: this.writeRotatedText('CDCR 103-F Education'),
                      fit: [7, 303],
                      style: 'hdrLeft',
                      margin: [2, 20, 2, 2],
                      rowSpan: 4,
                    },
                    {
                      image: this.writeRotatedText('Health Records'),
                      fit: [7, 303],
                      style: 'hdrLeft',
                      margin: [2, 20, 2, 2],
                      rowSpan: 4,
                    },
                    {
                      image: this.writeRotatedText('Psychiatric File'),
                      fit: [7, 303],
                      style: 'hdrLeft',
                      margin: [2, 20, 2, 2],
                      rowSpan: 4,
                    },
                    {
                      image: this.writeRotatedText(
                        'X-Ray - Do Not Forward to Parole'
                      ),
                      fit: [7, 303],
                      style: 'hdrLeft',
                      margin: [2, 20, 2, 2],
                      rowSpan: 4,
                    },
                    {
                      image: this.writeRotatedText(
                        'OTC / CCF / WF / DTF Flimsy'
                      ),
                      fit: [7, 303],
                      style: 'hdrLeft',
                      margin: [2, 20, 2, 2],
                      rowSpan: 4,
                    },
                    {
                      image: this.writeRotatedText('Temporary Medical File'),
                      fit: [7, 303],
                      style: 'hdrLeft',
                      margin: [2, 20, 2, 2],
                      rowSpan: 4,
                    },
                    {
                      image: this.writeRotatedText('Confidential File'),
                      fit: [7, 303],
                      style: 'hdrLeft',
                      margin: [2, 20, 2, 2],
                      rowSpan: 4,
                    },
                    {
                      image: this.writeRotatedText(' '),
                      fit: [7, 303],
                      style: 'hdrLeft',
                      margin: [0, 20, 0, 3],
                      rowSpan: 4,
                    },
                    {
                      image: this.writeRotatedText(' '),
                      fit: [7, 303],
                      style: 'hdrLeft',
                      margin: [0, 20, 0, 3],
                      rowSpan: 4,
                    },
                  ],
                  [
                    {
                      text: 'FROM:  ' + from,
                      style: 'hdrSchedule',
                      margin: [2, 8, 2, 30],
                      colSpan: 4,
                    },
                    {}, // Empty columns for alignment purposes
                    {},
                    {}, // Empty column for alignment purposes
                    { text: '', colSpan: 16 }, // Empty column occupied by vertical text
                  ],
                  [
                    {
                      text: 'TO:  ' + to,
                      style: 'hdrSchedule',
                      margin: [2, 8, 2, 30],
                      colSpan: 2,
                    },
                    {}, // Empty columns for alignment purposes
                    {
                      text: 'VIAS:  ' + vias,
                      style: 'hdrSchedule',
                      margin: [2, 8, 2, 30],
                      colSpan: 2,
                    },
                    {}, // Empty columns for alignment purposes
                    { text: '', colSpan: 16 }, // Empty column occupied by vertical text
                  ],
                  [
                    // Table data Header
                    { text: 'CDCR #', style: 'tblHeader' },
                    { text: 'Name', style: 'tblHeader', colSpan: 2 },
                    {},
                    { text: 'Discharge Date', style: 'tblHeader' },
                    { text: '', colSpan: 16 }, // Empty column occupied by vertical text
                  ],
                  ...data,
                ],
                border: [true, true, true, true],
              },
            },
          ],
          styles: {
            hdrLeft: {
              fontSize: 10,
              bold: true,
            },
            hdrRight: {
              fontSize: 10,
              alignment: 'right',
              bold: true,
            },
            hdrCopies: {
              fontSize: 9,
              alignment: 'right',
            },
            hdrSchedule: {
              fontSize: 10,
              bold: true,
            },
            tblHeader: {
              fontSize: 10,
              bold: true,
              margin: [1, 2, 1, 2],
            },
            tblLeft: {
              fontSize: 10,
              margin: [1, 3, 1, 3],
            },
            tblCenter: {
              fontSize: 10,
              alignment: 'center',
              margin: [1, 3, 1, 3],
            },
          },
        };

        console.log('create134PDF(): dd => ', dd);
        pdfMake.createPdf(dd).download(fileName);
        // alert("create134PDF() Done!");
      },
      async create7344() {
        // Get transfer for selected schedule
        let filter = {
          query: {
            $limit: 50,
            $sort: {
              transferDate: 1,
            },
            transferDate: {
              $gte: this.dateBegin,
              $lte: this.dateEnd,
            },
          },
        };

        try {
          // this.transfers = await this.readTransfers(filter);
          const response = await departuresArrivalsSvc.find(filter);
          console.log('create7344(): response => ', response);
          if (!response) {
            alert('No Transfers found for requested date range.');
            return;
          }
          this.n7334Transferring = response.data.length;

          let data = [];
          let row = [];
          let obj = [];
          let sch = '';
          for (let xfr of response.data) {
            if (sch !== xfr.schedule) {
              sch = xfr.schedule;

              // Column 1 - dashes
              obj = {
                text: '-----',
                style: 'schEntry',
                border: [false, false, false, false],
              };
              row.push(Object.assign({}, obj));

              // Column 2 - Date - Weekday, Month day, Year format
              const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              };
              const strDate = new Date(xfr.transferDate).toLocaleDateString(
                'en-US',
                options
              );
              obj = {
                text: strDate,
                style: 'schEntry',
                border: [false, false, false, false],
                colSpan: 2,
              };
              row.push(Object.assign({}, obj));

              // Column 3 - Empty column
              obj = {
                text: ' ',
                border: [false, false, false, false],
              };
              row.push(Object.assign({}, obj));

              // Column 4 - Schedule
              obj = {
                text: xfr.schedule,
                style: 'schEntry',
                border: [false, false, false, false],
              };
              row.push(Object.assign({}, obj));

              // Column 5 - Destination
              obj = {
                text: xfr.destination,
                style: 'schEntry',
                border: [false, false, false, false],
              };
              row.push(Object.assign({}, obj));

              // Column 6 - Vias
              obj = {
                text: xfr.vias,
                style: 'schEntry',
                border: [false, false, false, false],
              };
              row.push(Object.assign({}, obj));

              // Column 7 - dashes
              obj = {
                text: '-----',
                style: 'schEntry',
                border: [false, false, false, false],
              };
              row.push(Object.assign({}, obj));

              data.push(row);
              row = [];
            }

            // Column 1 - CDCR Number
            obj = {
              text: xfr.cdcrNumber,
              style: 'tblEntry',
              border: [false, false, false, false],
            };
            row.push(Object.assign({}, obj));

            // Column 2 - Last Name, First Name - colspan = 2
            obj = {
              text: xfr.lastName + ', ' + xfr.firstName,
              style: 'tblEntry',
              border: [false, false, false, false],
              colSpan: 2,
            };
            row.push(Object.assign({}, obj));

            // Column 3 - Empty column
            obj = {
              text: ' ',
              style: 'tblEntry',
              border: [false, false, false, false],
            };
            row.push(Object.assign({}, obj));

            // Column 4 - Housing
            obj = {
              text: xfr.housing,
              style: 'tblEntry',
              border: [false, false, false, false],
            };
            row.push(Object.assign({}, obj));

            // Column 5 - Security Level
            obj = {
              text: xfr.securityLevel,
              style: 'tblEntry',
              border: [false, false, false, false],
            };
            row.push(Object.assign({}, obj));

            // Column 6 - Ethnicity
            obj = {
              text: xfr.ethnicity,
              style: 'tblEntry',
              border: [false, false, false, false],
            };
            row.push(Object.assign({}, obj));

            // Column 7 - Specific Transfer Reason
            obj = {
              text: xfr.transferReasonCode,
              style: 'tblEntry',
              border: [false, false, false, false],
            };
            row.push(Object.assign({}, obj));

            data.push(row);
            row = [];
          }
          // Fill empty rows to max 24 per page

          console.log('create7344(): data => ', data);
          if (data) {
            this.create7344PDF(data);
          } else {
            // error message
            alert('Could not create CDCR 7344 PDF Document!');
          }
        } catch (ex) {
          console.error('create7344() exception: ', ex);
        }
      },
      create7344PDF(data) {
        this.bError = false;
        console.log('create7344PDF(): data => ' + data);

        const fileName = this.fileName + '.pdf';
        // playground requires you to assign document definition to a variable called dd

        const today = new Date();
        //console.log('new Date(): today', today);
        const m = today.getMonth() + 1;
        const mm = m < 10 ? '0' + m : m;
        const d = today.getDate();
        const day = d < 10 ? '0' + d : d;
        const h = today.getHours();
        const hh = h < 10 ? '0' + h : h;
        const ms = today.getMinutes();
        const mins = ms < 10 ? '0' + ms : ms;
        const dateNow =
          mm + '/' + day + '/' + today.getFullYear() + ' ' + hh + ':' + mins;

        let paperType = 'LETTER';
        this.reportTitle = 'ADVANCE TRANSFER NOTICE';

        const dd = {
          defaultStyle: {
            fontSize: 11,
          },

          pageSize: paperType, // 'LETTER'
          pageOrientation: 'PORTRAIT',
          pageMargins: [25, 25, 25, 25],

          styles: {
            header: {
              bold: true,
              fontSize: 9,
            },

            appName: {
              bold: true,
              fontSize: 10,
            },

            reportTitle: {
              alignment: 'center',
              bold: true,
              fontSize: 11,
            },

            tblHeader: {
              bold: true,
              fontSize: 10,
              margin: [2, 3, 2, 3],
            },

            schEntry: {
              bold: true,
              fontSize: 9,
            },

            tblEntry: {
              fontSize: 10,
            },
          },

          footer: function (currentPage, pageCount) {
            let footer = {
              text: currentPage.toString() + ' of ' + pageCount,
              alignment: 'center',
            };
            return footer;
          },

          content: [
            // =============================
            // State and Agency
            // =============================
            {
              columns: [
                {
                  text: this.stateOf,
                  style: 'header',
                },
                {
                  text: this.agency,
                  style: 'header',
                  alignment: 'right',
                },
              ],
            },
            // =============================
            // Report Form & Date
            // =============================
            {
              columns: [
                {
                  text: this.report7344,
                  style: 'header',
                },
                {
                  text: dateNow, //'02/11/2021 08:08:08 AM',
                  style: 'header',
                  alignment: 'right',
                },
              ],
            },
            // =============================
            // Institution
            // =============================
            {
              columns: [
                {
                  //text: 'Institutions Name: ' + this.selInstitutions,
                  text: 'Institution Name: ' + this.selectedInstitution,
                  style: 'header',
                  margin: [0, 8, 0, 0],
                },
              ],
            },
            // =============================
            // Report Title
            // =============================
            {
              columns: [
                {
                  text: this.reportTitle,
                  style: 'header',
                  alignment: 'center',
                  margin: [0, 3, 0, 0],
                },
              ],
            },
            // =============================
            // To
            // =============================
            {
              columns: [
                {
                  text: 'TO : All Departments',
                  style: 'header',
                  margin: [0, 3, 0, 0],
                },
              ],
            },
            // =============================
            // From
            // =============================
            {
              columns: [
                {
                  text: 'FROM : Transfer Desk - Records Office',
                  style: 'header',
                  margin: [0, 3, 0, 0],
                },
              ],
            },
            // =============================
            // RE
            // =============================
            {
              columns: [
                {
                  text: 'RE : NUMBER TRANSFERRING ' + this.n7334Transferring,
                  style: 'header',
                  margin: [0, 3, 0, 0],
                },
              ],
            },
            // =============================
            // Instructions
            // =============================
            {
              columns: [
                {
                  text: 'The inmates listed below will be transferred as indicated.  Please forward alll materials to the case records transfer desk immediately.',
                  fontSize: 9,
                  margin: [5, 3, 5, 3],
                },
              ],
            },
            // =============================
            // Table of Report Records
            // =============================
            {
              columns: [
                {
                  width: '*',
                  //layout: 'lightHorizontalLines', // optional
                  layout: {
                    // eslint-disable-next-line
                    fillColor: function (rowIndex, node, columnIndex) {
                      return rowIndex % 2 === 0 ? '#F0F0F0' : null;
                    },
                  },
                  table: {
                    // headers are automatically repeated if the table spans over multiple pages
                    // you can declare how many rows should be treated as headers
                    headerRows: 1,

                    // Determines the width of each column.
                    // auto = fit to contents
                    // * = stretch to fill
                    // widths: ['*', 'auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
                    // widths: this.pdfColWidth,
                    widths: [
                      'auto',
                      'auto',
                      'auto',
                      'auto',
                      'auto',
                      'auto',
                      '*',
                    ],

                    // The ... is a operator that expands the array or flattens
                    // The header row is then combined with the data to make one array
                    // body: [this.pdfHeaderRow, ...this.pdfData],
                    body: [
                      [
                        // Header Row
                        {
                          text: 'CDCR #',
                          style: 'tblHeader',
                          border: [false, true, false, true],
                          // margin: [ 2, 3, 2, 3],
                        },
                        {
                          text: 'Name',
                          style: 'tblHeader',
                          border: [false, true, false, true],
                          // margin: [ 2, 3, 2, 3],
                        },
                        {
                          text: '',
                          style: 'tblHeader',
                          border: [false, true, false, true],
                          // margin: [ 2, 3, 2, 3],
                        },
                        {
                          text: 'Housing',
                          style: 'tblHeader',
                          border: [false, true, false, true],
                          // margin: [ 2, 3, 2, 3],
                        },
                        {
                          text: 'Level',
                          style: 'tblHeader',
                          border: [false, true, false, true],
                          // margin: [ 2, 3, 2, 3],
                        },
                        {
                          text: 'Ehtnic',
                          style: 'tblHeader',
                          border: [false, true, false, true],
                          // margin: [ 2, 3, 2, 3],
                        },
                        {
                          text: 'Specific Transfer Reason',
                          style: 'tblHeader',
                          border: [false, true, false, true],
                          // margin: [ 2, 3, 2, 3],
                        },
                      ],
                      ...data,
                    ], // End of Table Body
                    border: [false, false, false, false],
                  },
                },
              ],
            },
          ],
        };

        console.log('create7344PDF(): dd => ', dd);
        pdfMake.createPdf(dd).download(fileName);
      },
      async createBusSeatReport() {
        let filter = {
          query: {
            $limit: 50,
            $sort: {
              transferDate: 1,
            },
            transferDate: {
              $gte: this.dateBegin,
              $lte: this.dateEnd,
            },
            destination: this.selEndorsedTo,
          },
        };

        try {
          const response = await this.readTransfers(filter);
          console.log('createBusSeatReport(): response => ', response);
          if (!response) {
            alert('No Transfers found for requested date range.');
            return;
          }
          this.n7334Transferring = response.data.length;

          const level = {
            txtDesc: '',
            numLevel: '',
            numScheduled: 0,
            numUnScheduled: 0,
            numHold: 0,
            numTotal: 0,
          };
          const levels = [];

          let data = [];
          let row = [];
          let obj = [];
          for (let lvl of levels) {
            // Column 1 - Level
            obj = {
              text: lvl.numLevel,
              style: 'schEntry',
              border: [false, false, false, false],
            };
            row.push(Object.assign({}, obj));

            // Column 2 - Scheduled
            obj = {
              text: lvl.numScheduled,
              style: 'schEntry',
              border: [false, false, false, false],
            };
            row.push(Object.assign({}, obj));

            // Column 3 - Unscheduled
            obj = {
              text: lvl.numUnScheduled,
              style: 'schEntry',
              border: [false, false, false, false],
            };
            row.push(Object.assign({}, obj));

            // Column 4 - Hold
            obj = {
              text: lvl.numHold,
              style: 'schEntry',
              border: [false, false, false, false],
            };
            row.push(Object.assign({}, obj));

            // Column 5 - Total
            obj = {
              text: lvl.numTotal,
              style: 'schEntry',
              border: [false, false, false, false],
            };
            row.push(Object.assign({}, obj));

            data.push(row);
            row = [];
          }
          // Fill empty rows to max 24 per page

          console.log('createBusSeatReport(): data => ', data);
          if (data) {
            this.createBusSeatPDF(data);
          } else {
            // error message
            alert('Could not create CDCR Bus Seat Report PDF Document!');
          }
        } catch (ex) {
          console.error('createBusSeatReport() exception: ', ex);
        }
      },
      createBusSeatPDF(data) {
        const fileName = this.fileName + '.pdf';
        // playground requires you to assign document definition to a variable called dd

        const today = new Date();
        const m = today.getMonth() + 1;
        const mm = m < 10 ? '0' + m : m;
        const d = today.getDate();
        const day = d < 10 ? '0' + d : d;
        const h = today.getHours();
        const hh = h < 10 ? '0' + h : h;
        const ms = today.getMinutes();
        const mins = ms < 10 ? '0' + ms : ms;
        const dateNow =
          mm + '/' + day + '/' + today.getFullYear() + ' ' + hh + ':' + mins;

        let paperType = 'LETTER';

        // Test data
        //this.selInstitutions = 'DVI';
        this.reportTitle = 'BUS SEAT REPORT';

        const dd = {
          defaultStyle: {
            fontSize: 11,
          },

          pageSize: paperType, // 'LETTER'
          pageOrientation: 'PORTRAIT',
          pageMargins: [25, 25, 25, 25],

          styles: {
            header: {
              bold: true,
              fontSize: 9,
            },

            appName: {
              bold: true,
              fontSize: 10,
            },

            reportTitle: {
              alignment: 'center',
              bold: true,
              fontSize: 11,
            },

            tblHeader: {
              bold: true,
              fontSize: 10,
              margin: [2, 3, 2, 3],
            },

            schEntry: {
              bold: true,
              fontSize: 9,
            },

            tblEntry: {
              fontSize: 10,
            },
          },

          footer: function (currentPage, pageCount) {
            let footer = {
              text: currentPage.toString() + ' of ' + pageCount,
              alignment: 'center',
            };
            return footer;
          },

          content: [
            // =============================
            // Report From & Date
            // =============================
            {
              columns: [
                {
                  text: this.from,
                  style: 'header',
                },
                {
                  text: dateNow, //'02/11/2021 08:08:08 AM',
                  style: 'header',
                  alignment: 'right',
                },
              ],
            },
            // =============================
            // Agency
            // =============================
            {
              columns: [
                {
                  text: this.agency,
                  style: 'header',
                  alignment: 'center',
                  margin: [0, 2, 0, 0],
                },
              ],
            },
            // =============================
            // Application Name
            // =============================
            {
              columns: [
                {
                  text: this.appName,
                  style: 'header',
                  alignment: 'center',
                  margin: [0, 2, 0, 0],
                },
              ],
            },
            // =============================
            // Report Title
            // =============================
            {
              columns: [
                {
                  text: this.reportTitle,
                  style: 'header',
                  alignment: 'center',
                  margin: [0, 2, 0, 0],
                },
              ],
            },
            // =============================
            // Endorsed To
            // =============================
            {
              columns: [
                {
                  text: 'Endorsed To : ' + this.selEndorsedTo,
                  style: 'header',
                },
              ],
            },
            // =============================
            // Table of Report Records
            // =============================
            {
              columns: [
                {
                  width: '*',
                  //layout: 'lightHorizontalLines', // optional
                  layout: {
                    // eslint-disable-next-line
                    fillColor: function (rowIndex, node, columnIndex) {
                      return rowIndex % 2 === 0 ? '#F0F0F0' : null;
                    },
                  },
                  table: {
                    // headers are automatically repeated if the table spans over multiple pages
                    // you can declare how many rows should be treated as headers
                    headerRows: 1,

                    // Determines the width of each column.
                    // auto = fit to contents
                    // * = stretch to fill
                    // widths: ['*', 'auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
                    // widths: this.pdfColWidth,
                    widths: ['*', 'auto', 'auto', 'auto', 'auto'],

                    // The ... is a operator that expands the array or flattens
                    // The header row is then combined with the data to make one array
                    // body: [this.pdfHeaderRow, ...this.pdfData],
                    body: [
                      [
                        {
                          text: 'Level',
                          style: 'tblHeader',
                          border: [false, true, false, true],
                          // margin: [ 2, 3, 2, 3],
                        },
                        {
                          text: 'Scheduled',
                          style: 'tblHeader',
                          border: [false, true, false, true],
                          // margin: [ 2, 3, 2, 3],
                        },
                        {
                          text: 'UnScheduled',
                          style: 'tblHeader',
                          border: [false, true, false, true],
                          // margin: [ 2, 3, 2, 3],
                        },
                        {
                          text: 'Hold',
                          style: 'tblHeader',
                          border: [false, true, false, true],
                          // margin: [ 2, 3, 2, 3],
                        },
                        {
                          text: 'Total',
                          style: 'tblHeader',
                          border: [false, true, false, true],
                          // margin: [ 2, 3, 2, 3],
                        },
                      ],
                      // ...data,
                      [
                        {
                          text: '----- ACP - Alternative Custody Program -----',
                          style: 'schEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: '',
                          style: 'schEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: '',
                          style: 'schEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: '',
                          style: 'schEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: '',
                          style: 'schEntry',
                          border: [false, false, false, false],
                        },
                      ], // End of Row 1
                      [
                        {
                          text: '1',
                          style: 'tblEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: '0',
                          style: 'tblEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: '2',
                          style: 'tblEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: '0',
                          style: 'tblEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: '2',
                          style: 'tblEntry',
                          border: [false, false, false, false],
                        },
                      ], // End of Row 2
                      [
                        {
                          text: 'Total',
                          style: 'tblEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: '0',
                          style: 'tblEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: '2',
                          style: 'tblEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: '0',
                          style: 'tblEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: '2',
                          style: 'tblEntry',
                          border: [false, false, false, false],
                        },
                      ], // End of Row 2
                    ], // End of Table Body
                    border: [false, false, false, false],
                  },
                },
              ],
            },
          ],
        };

        console.log('createBusSeatPDF(): dd => ', dd);
        pdfMake.createPdf(dd).download(fileName);

        // alert("createBusSeatPDF() Done!");
      },
      async readSchedulesByInstitution() {
        await this.readSchedules({
          query: {
            origin: this.selectedInstitution,
          },
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
  .selInstitution {
    background-color: white;
    border-radius: 5px;
  }
</style>
