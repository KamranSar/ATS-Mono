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
          <InstitutionDropdown
            v-model="selectedInstitution"
            :loading="loading"
          />
        </v-col>
        <v-col align="right" align-self="center">
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
                  item-value="title"
                  return-object
                  class="my-2 pl-1"
                  clearable
                  hide-details="true"
                  dense
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
                  @change="cdcrNum = cdcrNum.toUpperCase()"
                  @keyup="cdcrNum = cdcrNum.toUpperCase()"
                  clearable
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
                    @change="onChangeBeginDate"
                    clearable
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
                  item-value="title"
                  return-object
                  class="my-2 pl-1"
                  clearable
                  hide-details="true"
                  dense
                ></v-select>
                <!-- <v-select
                  label="By Schedule"
                  placeholder="Schedule"
                  :items="schedules"
                  item-text="title"
                  item-value="title"
                  v-model="sel134Schedule"
                  class="vselectTxtColor"
                  dense
                  @change="onChangeSchedule"
                ></v-select> -->
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
                  <span class="title">Bus Seat Report</span>
                  <br />
                  <!-- Line below is colored the same as background to hide text & to make things line up -->
                  <span style="font-size: 12px; color: #cfd8dc">.</span>
                </v-col>
              </v-row>
            </v-card-title>
            <v-row no-gutters class="mx-4">
              <v-col cols="6">
                <v-select
                  label="Endorsed To"
                  placeholder="Endorsed To"
                  :items="listOfInstitutions"
                  item-text="institutionName"
                  item-value="institutionId"
                  v-model="selEndorsedTo"
                  class="vselectTxtColor"
                  clearable
                  dense
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
              <v-spacer />
              <v-col cols="auto">
                <v-icon large color="primary" @click="createBusSeat">
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
  import DateRangePicker from '@/components/util/DateRangePicker.vue';
  import InstitutionDropdown from '@/components/util/InstitutionDropdown.vue';
  import { get, sync, call } from 'vuex-pathify';
  import pdfMake from 'pdfmake/build/pdfmake';
  import pdfFonts from 'pdfmake/build/vfs_fonts';
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  import departuresArrivalsSvc from '@/feathers/services/departuresarrivals/departuresarrivals.service.js';
  import createBusSeat from '@/pdfs/createBusSeat.js';
  import createBusOrderSeat from '@/pdfs/createBusOrderSeat.js';

  export default {
    name: 'Reports',
    components: {
      DateRangePicker,
      InstitutionDropdown,
    },
    data: (vm) => ({
      loading: false,
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
      ...sync('institutions', ['selectedInstitution']),
      ...get('institutions', ['listOfInstitutions']),
      ...get('users', ['loggedInUser']),
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
      onChangeBeginDate(ctrl) {
        console.log('onChangeBeginDate(): ctrl => ', ctrl);
      },
      onChangeEndorsedDate(ctrl) {
        console.log('onChangeEndorsedDate(); ctrl => ', ctrl);
      },
      onChangeArrivalDate(ctrl) {
        console.log('onChangeEndorsedDate(); ctrl => ', ctrl);
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

      // ****************************************
      // Methods to create PDF documents
      //
      // ****************************************

      // create135()
      // retrieves and creates the data
      // to be loaded in the PDF doc
      async create135(param) {
        let filter = {
          query: {
            $limit: 50,
            $sort: {
              transferDate: 1,
            },
          },
        };

        // if (param == 'schedule' && this.sel135Schedule) {
        //   filter.query.title = this.sel135Schedule;
        if (param == 'schedule' && this.selSchedule) {
          filter.query.scheduleId = this.selSchedule._id;
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
          console.log('create135(): filter => ', filter);
          this.transfers = await this.readTransfers(filter);
          console.log('create135(): transfers => ', this.transfers);
          if (!this.transfers) {
            alert('No Transfers found for schedule: ', this.schedule.title);
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
          this.create135PDF(data);
        } else {
          // error message
          alert('Could not create CDCR 135 PDF Document!');
        }
      },
      // create135PDF()
      // Creates a Transfer Record
      // Creates a pdf file using PDFMake
      // ********************************
      create135PDF(data) {
        console.log('create135PDF(): data => ', data);

        let doc =
          this.stateOf +
          '\n' +
          this.report135 +
          '\nDISTRIBUTION PER INSTITUTION POLICY';
        let reportTitle = 'TRANSFER RECORD';
        let agency = this.agency;

        let dtLabel =
          'The following identified persons will be transferred this date';
        let xfrNum = this.schedules.length;
        let title = this.schedules[0].title;
        let to = this.schedules[0].destination;
        let from = this.getInstitutionId(this.schedules[0].origin);
        let vias = this.schedules[0].vias;
        let xfrDate = this.schedules[0].transferDate;

        let today = new Date().toISOString();
        let fileName = `135_${today}.pdf`;
        if (data.length === 1) {
          fileName = `135_${this.cdcrNum}_${today}.pdf`;
        } else {
          fileName = `135_${this.schedules[0].title}_${today}.pdf`;
        }

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
                      text: 'Specific Transfer Reason',
                      style: 'tblHeader',
                    },
                    { text: '135 Comments', style: 'tblHeader' },
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
      // create134()
      // Builds the document format for the 134 report
      // Calls create134PDF(data) to generate PDF report file
      // ********************************
      async create134() {
        // Get transfer for selected schedule
        console.log('create134(): this.selSchedule => ', this.selSchedule);
        if (!this.selSchedule || !this.selSchedule._id) {
          this.setSnackbar(
            'Schedule not selected. Please select a schedule and try again.'
          );
          return;
          // let res = confirm(
          //   'A schedule was not selected. Click OK to print an empty Transfer Check Sheet. Click CANCEL to select a schedule and try again.'
          // );
          // if (res) {
          //   this.transfers = [];
          //   goto;
          //   EmptySheet;
          // } else {
          //   return;
          // }
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
          console.log('build134Data(): transfers => ', this.transfers);
          if (!this.transfers) {
            alert('No Transfers found for schedule: ', this.selSchedule.title);
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

        // [EmptySheet];
        // Fill empty rows to max 24 per page
        const nXfrs =
          this.transfers.length < 24
            ? this.transfers.length
            : this.transfers.length % 24;
        const len = 24 - nXfrs;
        const emptyColumn = {
          text: ' ',
          style: 'tblLeft',
          // border: [false, false, false, false],
        };
        const col2 = {
          text: ' ',
          style: 'tblLeft',
          colSpan: 2,
        };
        for (let i = 0; i < len; i++) {
          for (let n = 0; n < 20; n++) {
            if (n !== 1) {
              row.push(Object.assign({}, emptyColumn));
            } else {
              row.push(Object.assign({}, col2));
            }
          }
          data.push(row);
          row = [];
        }

        console.log('create134(): data => ', data);
        if (data) {
          this.create134PDF(data);
        } else {
          // error message
          alert('Could not create CDCR 134 PDF Document!');
        }
      },
      // create134PDF()
      // Creates a Transfer Check Sheet
      // Creates a pdf file using PDFMake
      // ********************************
      create134PDF(data) {
        console.log('create134PDF(): data => ' + data);

        // const fileName = this.fileName + '.pdf';
        let today = new Date().toISOString().split('T')[0];

        let title = 'RECORDS TRANSFER CHECK SHEET';
        let txtOriginal = 'Original-Receiving Facility/Region Records';
        let txtCopy = 'Copy-Sending Facility/Region Records';

        let nXfer = this.transfers.length;

        let from = this.getInstitutionId(this.selSchedule.origin);
        let to = this.selSchedule.destination;
        let vias = this.selSchedule.vias;
        let txtDate = this.selSchedule.transferDate;

        const fileName = `134_${from}_${today}.pdf`;

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
      // create7344()
      // Builds the document format for the 7344 report
      // Calls create7344PDF(data) to generate PDF report file
      // ********************************
      async create7344() {
        if (!this.selectedInstitution) {
          console.log(
            'create7344(): selectedInstitution => ',
            this.selectedInstitution
          );
          this.setSnackbar('Please select an Instittution.', 'error', 3000);
          return;
        }

        if (!this.dateBegin) {
          console.log('create7344(): dateBegin => ', this.dateBegin);
          this.setSnackbar('Please select a Begin date.', 'error', 3000);
          return;
        }

        if (!this.dateEnd) {
          console.log('create7344(): dateEnd => ', this.dateEnd);
          this.setSnackbar('Please select a End date.', 'error', 3000);
          return;
        }

        if (this.dateBegin > this.dateEnd) {
          console.log(
            `create7344(): dateBegin => ${this.dateBegin}. dateEnd => ${this.dateEnd}.`
          );
          this.setSnackbar(
            'The date range is invalid. End date is earlier than Begin date. Please fix and try again.',
            'error',
            6000
          );
          return;
        }

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
            origin: this.selectedInstitution.institutionName,
          },
        };

        try {
          // this.transfers = await this.readTransfers(filter);
          const response = await departuresArrivalsSvc.find(filter);
          console.log('create7344(): response => ', response);
          if (response.data.length == 0) {
            alert('No Transfers found for requested date range.');
            return;
          }
          this.n7334Transferring = response.data.length;

          let data = [];
          let row = [];
          let obj = [];
          let sch = '';
          for (let xfr of response.data) {
            if (sch !== xfr.title) {
              sch = xfr.title;

              // Column 1 - dashes
              obj = {
                text: '-----',
                style: 'schEntry',
                border: [false, false, false, false],
                fillColor: '#F0F0F0',
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
                fillColor: '#F0F0F0',
              };
              row.push(Object.assign({}, obj));

              // Column 3 - Empty column
              obj = {
                text: ' ',
                border: [false, false, false, false],
                fillColor: '#F0F0F0',
              };
              row.push(Object.assign({}, obj));

              // Column 4 - Schedule
              obj = {
                text: xfr.title,
                style: 'schEntry',
                border: [false, false, false, false],
                fillColor: '#F0F0F0',
              };
              row.push(Object.assign({}, obj));

              // Column 5 - Destination
              obj = {
                text: xfr.destination,
                style: 'schEntry',
                border: [false, false, false, false],
                fillColor: '#F0F0F0',
              };
              row.push(Object.assign({}, obj));

              // Column 6 - Vias
              obj = {
                text: xfr.vias,
                style: 'schEntry',
                border: [false, false, false, false],
                fillColor: '#F0F0F0',
              };
              row.push(Object.assign({}, obj));

              // Column 7 - dashes
              obj = {
                text: '-----',
                style: 'schEntry',
                border: [false, false, false, false],
                fillColor: '#F0F0F0',
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
          // const len = 20 - response.data.length;
          // const emptyColumn = {
          //   text: ' ',
          //   style: 'tblEntry',
          //   border: [false, false, false, false],
          // };
          // for (let i = 0; i < len; i++) {
          //   for (let n = 0; n < 7; n++) {
          //     row.push(Object.assign({}, emptyColumn));
          //   }
          //   data.push(row);
          //   row = [];
          // }
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
      // create7344PDF()
      // Creates a Advanced Transfer Notice
      // Creates a pdf file using PDFMake
      // ********************************
      create7344PDF(data) {
        console.log('create7344PDF(): data => ' + data);

        // const fileName = this.fileName + '.pdf';

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

        const fileName = `7344_${
          this.selectedInstitution.institutionId
        }_${today.toISOString()}.pdf`;

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
                  text:
                    'Institution Name: ' +
                    this.selectedInstitution.institutionId,
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
                  layout: 'lightHorizontalLines', // optional
                  // layout: {
                  //   // eslint-disable-next-line
                  //   fillColor: function (rowIndex, node, columnIndex) {
                  //     return rowIndex % 2 === 0 ? '#F0F0F0' : null;
                  //   },
                  //},
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
      // createBusSeat()
      // Builds data for Bus Seat report
      // Calls createBusSeatPDF(data) to generate PDF report file
      // *******************************
      createBusSeat() {
        createBusSeat(this.selEndorsedTo);
      },
      createBusOrderSeat() {
        createBusOrderSeat({
          dateEndorsed: this.dateEndorsed,
          selEndorsedTo: this.selEndorsedTo,
          includeScheduled: this.includeScheduled,
          arrivalDate: this.arrivalDate,
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
