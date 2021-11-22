<template>
  <div>
    <!-- <h1>Reports</h1> -->
    <h2>Reports</h2>
    <v-row flex>
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
                :items="itemsSchedules"
                v-model="sel135Schedule"
                class="vselectTxtColor"
                dense
              ></v-select>
            </v-col>
            <v-col cols="1" class="mx-4">
              <!-- <v-btn fab small color="primary" depressed style="margin-top: -8px" class="pa-2" @click="createPDF135">
                <v-icon >mdi-printer</v-icon>
              </v-btn> -->
              <v-btn
                class="blue-grey lighten-4"
                depressed
                max-width="36px"
                style="margin-top: -8px"
                @click="createPDF135"
              >
                <v-icon large color="primary">mdi-file-pdf</v-icon>
              </v-btn>
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
              <!-- <v-btn fab small color="primary" depressed style="margin-top: -8px" class="pa-2" @click="createPDF135">
                <v-icon >mdi-printer</v-icon>
              </v-btn> -->
              <v-btn
                class="blue-grey lighten-4"
                depressed
                max-width="36px"
                style="margin-top: -8px"
                @click="createPDF135"
              >
                <v-icon large color="primary">mdi-file-pdf</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card class="blue-grey lighten-4" min-width="200px" height="100%">
          <v-card-title style="line-height: 1rem">
            <v-row>
              <v-col>
                <span style="white-space: nowrap">Advance Transfer</span>
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
                  :min="minDate"
                  :max="maxDate"
                  @input="dateBeginMenu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="1" class="mx-4">
              <!-- <v-btn fab small color="primary" depressed style="margin-top: -8px" class="pa-2" @click="createPDF7344">
                <v-icon >mdi-printer</v-icon>
              </v-btn> -->
              <v-btn
                class="blue-grey lighten-4 pa-2"
                depressed
                max-width="36px"
                style="margin-top: -8px"
                @click="createPDF7344"
              >
                <v-icon large color="primary">mdi-file-pdf</v-icon>
              </v-btn>
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
                  :min="minDate"
                  :max="maxDate"
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
                <span style="white-space: nowrap">Transfer Check</span>
                <span style="white-space: nowrap">Sheet</span>
                <br />
                <span style="font-size: 12px">CDCR-134</span>
              </v-col>
            </v-row>
          </v-card-title>
          <v-row no-gutters>
            <v-col cols="6" class="mx-4">
              <!-- <v-text-field
                label="CDCR #"
                v-model="cdcrNum"
                dense
              ></v-text-field> -->
              <v-select
                label="By Schedule"
                placeholder="Schedule"
                :items="itemsSchedules"
                v-model="sel134Schedule"
                class="vselectTxtColor"
                dense
              ></v-select>
            </v-col>
            <v-col cols="1" class="mx-4">
              <v-btn
                class="blue-grey lighten-4 pa-2"
                depressed
                max-width="36px"
                style="margin-top: -8px"
                @click="createPDF134"
              >
                <!-- <v-icon >mdi-printer</v-icon> -->
                <v-icon large color="primary">mdi-file-pdf</v-icon>
              </v-btn>
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
                :items="itemsEndorsedTo"
                v-model="selEndorsedTo"
                class="vselectTxtColor"
                dense
              ></v-select>
            </v-col>
            <v-col cols="1" class="mx-4">
              <!-- <v-btn fab small color="primary" depressed style="margin-top: -8px" class="pa-2" @click="createPDFBusSeat">
                <v-icon>mdi-printer</v-icon>
              </v-btn> -->
              <v-btn
                class="blue-grey lighten-4 pa-2"
                depressed
                max-width="36px"
                style="margin-top: -8px"
                @click="createPDFBusSeat"
              >
                <v-icon large color="primary">mdi-file-pdf</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import pdfMake from 'pdfmake/build/pdfmake';
  import pdfFonts from 'pdfmake/build/vfs_fonts';
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  export default {
    name: 'Reports',
    data: (vm) => ({
      records: null,
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
    }),
    methods: {
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

      // show135Schedules() {
      //   if (this.chbx135Schedule)
      //   {
      //     this.sel135Schedule.style.display = 'block';
      //   } else {
      //     this.sel135Schedule.style.display = 'none';
      //   }
      // },

      // define your function for generating rotated text
      writeRotatedText(text) {
        var ctx,
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
      get135(param) {
        let filter = {
          query: {
            $sort: {
              dateReceived: 1,
            },
          },
        };

        if (param == 'schedule') {
          filter.query.schedule = this.sel135Schedule;
        } else if (param == 'cdcr') {
          filter.query.cdcrNumber = this.cdcrNum;
        } else {
          alert('Invalid option for CDCR-135 Transfer Record.');
          return;
        }
      },

      // createPDF135()
      //
      createPDF135() {
        const fileName = this.fileName + '.pdf';

        var doc =
          this.stateOf +
          '\n' +
          this.report135 +
          '\nDISTRIBUTION PER INSTITUTION POLICY';
        var title = 'TRANSFER RECORD';
        var agency = this.agency;

        var dtLabel =
          'The following identified persons will be transferred this date';
        var txtDate = '04/27/2021';
        var nXfer = '11';

        var schedule = 'SCH K';
        var from = 'DVI';
        var to = 'CMC-W';
        var via1 = 'NKSPRC';
        var via2 = '';

        // let txtFooter = (currentPage, pageCount) => {
        //   return currentPage.toString() + " of " + pageCount;
        // };
        // let aFooter = (currentPage, pageCount) => {
        // let pageNums = currentPage.toString() + " of " + pageCount;
        // return {
        //   table: {
        //     body: [
        //       {
        //         pageNums,
        //       },
        //     ],
        //   }, // End of table
        //   colSpan: 3,
        // };
        // };

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

          // footer: function(currentPage, pageCount) {
          //   return currentPage.toString() + " of " + pageCount;
          // },

          // footer: {
          // footer: function(currentPage, pageCount) {
          //   let pageNums = currentPage.toString() + " of " + pageCount;
          //   return {
          //     table: {
          //       widths: ["40%", "30%", "30%"],
          //       body: [
          //         [
          //           {
          //             text: "PREPARED BY:  ",
          //             style: "hdrSchedule",
          //             border: [true, true, false, true],
          //           },
          //           {
          //             text: "TITLE:  ",
          //             style: "hdrSchedule",
          //             border: [false, true, false, true],
          //           },
          //           {
          //             text: "SENDING INSTITUTION:  ",
          //             style: "hdrSchedule",
          //             border: [false, true, true, true],
          //           },
          //         ],
          //         [
          //           {
          //             text:
          //               "Receipt of the above-name persons and their records is acknowledged",
          //             fontSize: 6,
          //             alignment: "center",
          //             colSpan: 3,
          //           },
          //           {},
          //           {},
          //         ],
          //         [
          //           {
          //             text: "SIGNATURE OF TRANSPORTING OFFICER",
          //             style: "hdrSchedule",
          //             border: [true, true, false, true],
          //             rowSpan: 2,
          //           },
          //           {
          //             text: "TITLE",
          //             style: "hdrSchedule",
          //             border: [true, true, false, true],
          //             rowSpan: 2,
          //           },
          //           {
          //             text: "INSTITUTION  ",
          //             style: "hdrSchedule",
          //             border: [true, true, true, true],
          //             rowSpan: 2,
          //           },
          //         ],
          //         [
          //           { text: "1", border: [true, false, false, true] },
          //           { text: "1", border: [false, false, false, true] },
          //           { text: "1", border: [false, false, true, true] },
          //         ],
          //         [
          //           {
          //             text: "SIGNATURE OF RECEIVING OFFICER",
          //             style: "hdrSchedule",
          //             border: [true, true, false, true],
          //             rowSpan: 2,
          //           },
          //           {
          //             text: "TITLE",
          //             style: "hdrSchedule",
          //             border: [true, true, false, true],
          //             rowSpan: 2,
          //           },
          //           {
          //             text: "INSTITUTION  ",
          //             style: "hdrSchedule",
          //             border: [true, true, true, true],
          //             rowSpan: 2,
          //           },
          //         ],
          //         [
          //           { text: "2", border: [true, false, false, true] },
          //           { text: "2", border: [false, false, false, true] },
          //           { text: "2", border: [false, false, true, true] },
          //         ],
          //         [
          //           {
          //             text: pageNums,
          //             alignment: "right",
          //             style: "hdrSchedule",
          //             colSpan: 3,
          //           },
          //           {},
          //           {},
          //         ],
          //       ],
          //       borders: [true, true, true, true],
          //     }, // End of table
          //   };
          // },

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
                      text: 'DATE:  ' + txtDate,
                      style: 'hdrSchedule',
                      border: [false, true, false, true],
                    },
                    {
                      text: 'NUMBER TRANSFERRING:  ' + nXfer,
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
                              text: 'SCHEDULE:  ' + schedule,
                              style: 'hdrSchedule',
                              border: [false, false, false, false],
                              rowSpan: 2,
                            },
                            {
                              text: 'FROM:  ' + from,
                              style: 'hdrSchedule',
                              border: [false, false, false, false],
                              rowSpan: 2,
                            },
                            {
                              text: 'TO:  ' + to,
                              style: 'hdrSchedule',
                              border: [false, false, false, false],
                              rowSpan: 2,
                            },
                            {
                              text: 'VIA:  ' + via1,
                              style: 'hdrSchedule',
                              border: [true, false, false, false],
                            },
                          ],
                          [
                            {},
                            {},
                            {},
                            {
                              text: 'VIA: ' + via2,
                              style: 'hdrSchedule',
                              border: [true, true, false, false],
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
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 1
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 2
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 3
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 4
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 5
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 6
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 7
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 8
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 9
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 10
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 11
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 12
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 13
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 14
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 15
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 16
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 17
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 18
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 19
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 20
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 21
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 22
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 23
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 24
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 25
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 26
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 27
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 28
                          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 29
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

        console.log('createPDF135(): dd => ', dd);
        pdfMake.createPdf(dd).download(fileName);
        // alert("createPDF135() Done!");
      },

      createPDF134() {
        const fileName = this.fileName + '.pdf';

        var title = 'RECORDS TRANSFER CHECK SHEET';
        var txtOriginal = 'Original-Receiving Facility/Region Records';
        var txtCopy = 'Copy-Sending Facility/Region Records';

        var txtDate = '04/27/2021';
        var nXfer = '1';

        // var schedule = 'SCH K';
        var from = 'DVI';
        var to = 'PVSP';
        var via1 = 'NKSPRC';
        var via2 = '';

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
                      colSpan: 2,
                    },
                    {}, // Empty columns for alignment purposes
                    {
                      text: 'VIA:  ' + via1,
                      style: 'hdrSchedule',
                      margin: [2, 8, 2, 30],
                      colSpan: 2,
                    },
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
                      text: 'VIA:  ' + via2,
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
                  [
                    { text: 'AY8993', style: 'tblLeft' },
                    { text: 'GOMEZ, ANTHONY', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: '05/31/2042', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
                  [
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblLeft', colSpan: 2 },
                    {},
                    { text: ' ', style: 'tblLeft' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                    { text: ' ', style: 'tblCenter' },
                  ],
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

        console.log('createPDF134(): dd => ', dd);
        pdfMake.createPdf(dd).download(fileName);
        // alert("createPDF134() Done!");
      },

      createPDF7344() {
        this.bError = false;
        console.log('createPDF7344(): requests => ' + this.requests);

        const fileName = this.fileName + '.pdf';
        // playground requires you to assign document definition to a variable called dd

        // Report fields to be sent in when building report
        // Institution
        // Report Name
        // Date Range
        // Assigned To
        // Column Names
        // Column values
        // let doc = this.stateOf + '\n' + this.report135 + '\nDISTRIBUTION PER INSTITUTION POLICY';
        // let title = 'TRANSFER RECORD';
        // let agency = this.agency;

        // let dtLabel = 'The following identified persons will be transferred this date';
        // let txtDate = '04/27/2021';
        // let nXfer = '11';

        // let schedule = 'SCH K';
        // let from = 'DVI';
        // let to = 'CMC-W';
        // let via1 = 'NKSPRC';
        // let via2 = '';

        // if (!this.buildPDFHeaderRow()) {
        //   // Display Error Message
        //   return;
        // }
        // this.buildPDFRowData();

        const today = new Date();
        //console.log('new Date(): today', today);
        const m = today.getMonth();
        const mm = m < 10 ? '0' + m : m;
        const d = today.getDate();
        const day = d < 10 ? '0' + d : d;
        const h = today.getHours();
        const hh = h < 10 ? '0' + h : h;
        const ms = today.getMinutes();
        const mins = ms < 10 ? '0' + ms : ms;
        const dateNow =
          mm + '/' + day + '/' + today.getFullYear() + ' ' + hh + ':' + mins;
        //console.log('dateNow: ', dateNow);

        // const assigned = this.assignedTo == '' ? 'ALL' : this.assignedTo;

        let paperType = 'LETTER';
        // let lenSeparatorLine = 712;
        // let rtltColumn = { width: '*', text: '' };

        // if (this.pdfColWidth.length > 6) {
        //   paperType = 'LEGAL';
        //   lenSeparatorLine = 927;
        // }

        // if (this.pdfColWidth.length > 11) {
        //   paperType = 'TABLOID';
        //   lenSeparatorLine = 1142;
        // }

        // if (this.pdfColWidth.length > 16) {
        //   paperType = 'B3';
        //   lenSeparatorLine = 1337;
        //   rtltColumn = [];
        // }

        // console.log(
        //   'printPDFReport(): this.pdfColWidth.length => ' + this.pdfColWidth.length + ', paperType => ' + paperType
        // );

        // Test data
        this.selInstitutions = 'DVI';
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
                  text: 'Institution Name: ' + this.selInstitutions,
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
                  // text: 'RE: NUMBER TRANSFERRING ' + this.records.count,
                  text: 'RE : NUMBER TRANSFERRING ',
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
                      [
                        {
                          text: '------',
                          style: 'schEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: 'Thursday, February 22, 2021',
                          style: 'schEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: 'SCH K',
                          style: 'schEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: '',
                          style: 'schEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: 'CAL-ICE',
                          style: 'schEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: 'VIA: KVSP,',
                          style: 'schEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: '------',
                          style: 'schEntry',
                          border: [false, false, false, false],
                        },
                      ], // End of Row 1
                      [
                        {
                          text: 'BC9030',
                          style: 'tblEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: 'AVALOS, JORGE',
                          style: 'tblEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: '',
                          style: 'tblEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: 'A 001A2004008U',
                          style: 'tblEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: 'II',
                          style: 'tblEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: 'HIS',
                          style: 'tblEntry',
                          border: [false, false, false, false],
                        },
                        {
                          text: 'USINS',
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

        console.log('createPDF7344(): dd => ', dd);
        pdfMake.createPdf(dd).download(fileName);

        // alert("createPDF7344() Done!");
      },

      createPDFBusSeat() {
        const fileName = this.fileName + '.pdf';
        // playground requires you to assign document definition to a variable called dd

        // Report fields to be sent in when building report
        // Institution
        // Report Name
        // Date Range
        // Assigned To
        // Column Names
        // Column values
        // let doc = this.stateOf + '\n' + this.report135 + '\nDISTRIBUTION PER INSTITUTION POLICY';
        // let title = 'TRANSFER RECORD';
        // let agency = this.agency;

        // let dtLabel = 'The following identified persons will be transferred this date';
        // let txtDate = '04/27/2021';
        // let nXfer = '11';

        // let schedule = 'SCH K';
        // let from = 'DVI';
        // let to = 'CMC-W';
        // let via1 = 'NKSPRC';
        // let via2 = '';

        // if (!this.buildPDFHeaderRow()) {
        //   // Display Error Message
        //   return;
        // }
        // this.buildPDFRowData();

        const today = new Date();
        //console.log('new Date(): today', today);
        const m = today.getMonth();
        const mm = m < 10 ? '0' + m : m;
        const d = today.getDate();
        const day = d < 10 ? '0' + d : d;
        const h = today.getHours();
        const hh = h < 10 ? '0' + h : h;
        const ms = today.getMinutes();
        const mins = ms < 10 ? '0' + ms : ms;
        const dateNow =
          mm + '/' + day + '/' + today.getFullYear() + ' ' + hh + ':' + mins;
        //console.log('dateNow: ', dateNow);

        // const assigned = this.assignedTo == '' ? 'ALL' : this.assignedTo;

        let paperType = 'LETTER';
        // let lenSeparatorLine = 712;
        // let rtltColumn = { width: '*', text: '' };

        // if (this.pdfColWidth.length > 6) {
        //   paperType = 'LEGAL';
        //   lenSeparatorLine = 927;
        // }

        // if (this.pdfColWidth.length > 11) {
        //   paperType = 'TABLOID';
        //   lenSeparatorLine = 1142;
        // }

        // if (this.pdfColWidth.length > 16) {
        //   paperType = 'B3';
        //   lenSeparatorLine = 1337;
        //   rtltColumn = [];
        // }

        // console.log(
        //   'printPDFReport(): this.pdfColWidth.length => ' + this.pdfColWidth.length + ', paperType => ' + paperType
        // );

        // Test data
        this.selInstitutions = 'DVI';
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
                  text: 'Endorsed To : DVI', // + this.to,
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

        console.log('createPDFBusSeat(): dd => ', dd);
        pdfMake.createPdf(dd).download(fileName);

        // alert("createPDFBusSeat() Done!");
      },
    },
  };
</script>

<style scoped></style>
