<template>
  <!-- <v-card elevation="3" class="ma-4 px-4 pb-4">
    <v-card-title>
      <h2>Institution Transfers</h2>
    </v-card-title> -->
  <v-card flat class="mb-12">
    <v-card-title class="blue-grey lighten-4">
      <v-row>
        <v-col cols="4" xs="12" md="4" class="py-1" align-self="center">
          <h2>Home</h2>
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
            :disabled="loading"
            :items="listOfInstitutions"
            color="blue-grey lighten-2"
            label="Institution"
            item-text="institutionName"
            item-value="institutionName"
            return-object
            prepend-icon="mdi-bank"
            clearable
            hide-details="auto"
            class="ma-1 pa-1"
            autofocus
            background-color="white"
            @change="onChangeInstitution"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-card-title>
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      color="primary"
    ></v-progress-linear>
    <v-row class="mx-2 mt-2">
      <v-col cols="6"><h2>Departures</h2></v-col>
      <!-- FIXME remove <v-col cols="6" class="text-right">
          <v-btn x-large class="secondary" href="/transfer">
            New Offender Transfer
          </v-btn>
          <v-btn x-large class="secondary ml-2" href="/schedule">
            Go to Schedules
          </v-btn>
        </v-col> -->
    </v-row>
    <v-data-table
      :items-per-page="itemsPerPage"
      dense
      :headers="departureHeaders"
      :items="departures"
      item-key="cdcrNumber"
      class="elevation-1 mx-4 mb-4 pa-4"
      :search="departureSearch"
      @keypress="filterTransfers"
      :loading="loading"
      loading-text="Syncing Data with SOMS... Please wait"
      no-data-text="No Pending Departures"
      no-results-text="No Departing Offender Data Found"
    >
      <template v-slot:top>
        <v-row>
          <v-col cols="4">
            <v-text-field
              dense
              v-model="departureSearch"
              label="Search Departing Offender Information"
              class="mx-4"
              prepend-inner-icon="mdi-magnify"
              clearable
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
          <!-- <v-col cols="2" align-self="right">
            <v-btn small class="secondary mt-2">
              <v-icon left>mdi-printer</v-icon>Print All Departing 135's
            </v-btn>
          </v-col> -->
        </v-row>
      </template>
      <template v-slot:item.cdcrNumber="{ item }">
        <router-link
          :to="{
            name: 'Transfer Details',
            params: { cdcrNumber: item.cdcrNumber },
          }"
          @click.native="updateSelected(item)"
        >
          {{ item.cdcrNumber }}
        </router-link>
      </template>
      <template v-slot:item.fullName="{ item }">
        <span>{{ item.firstName }} {{ item.lastName }}</span>
      </template>
      <template v-slot:item.schedule="{ item }">
        <router-link to="">{{ item.schedule }}</router-link>
      </template>
      <template v-slot:item.print135="{ item }">
        <!-- <router-link to="">
          {{ item.print135 }} -->
        <v-icon
          color="primary"
          class="ml-5"
          @click="create135(item, 'departures')"
        >
          mdi-file-document
        </v-icon>
        <!-- </router-link> -->
      </template>
      <!-- <template v-slot:item.updates="{ item }">
        <v-icon color="green" class="ml-3" v-if="item.updates == true">
          mdi-check-bold
        </v-icon>
      </template> -->

      <!-- <template
        v-slot:footer
      >
        <v-row>
          <v-col class="text-center mt-2">
<v-btn>Print all 135's</v-btn>
          </v-col>
        </v-row>
          
        
      </template> -->
    </v-data-table>
    <v-row class="mx-2">
      <v-col cols="12"><h2>Arrivals</h2></v-col>
    </v-row>
    <v-data-table
      :items-per-page="itemsPerPage"
      dense
      :headers="arrivalHeaders"
      :items="arrivals"
      item-key="cdcrNumber"
      class="elevation-1 mx-4 mb-4 pa-4"
      :search="arrivalSearch"
      @keypress="filterOffenderArrivals"
      no-data-text="No Pending Arrivals"
      no-results-text="No Arriving Offender Data Found"
    >
      <template v-slot:top>
        <v-row>
          <v-col cols="4">
            <v-text-field
              dense
              v-model="arrivalSearch"
              label="Search Arriving Offender Information"
              class="mx-4"
              prepend-inner-icon="mdi-magnify"
              clearable
            >
            </v-text-field>
          </v-col>
          <v-spacer></v-spacer>
          <!-- <v-col cols="2" align-self="right">
            <v-btn small class="secondary mt-2">
              <v-icon left>mdi-printer</v-icon>Print All Arriving 135's
            </v-btn>
          </v-col> -->
        </v-row>
      </template>
      <template v-slot:item.fullName="{ item }">
        <span>{{ item.firstName }} {{ item.lastName }}</span>
      </template>
      <template v-slot:item.origin="{ item }">
        <span>{{ getInstitutionId(item.origin) }}</span>
      </template>
      <!-- <template v-slot:item.updates="{ item }">
        <v-icon class="ml-3" v-if="item.updates == true">
          mdi-check-bold
        </v-icon>
      </template> -->
      <template v-slot:item.preprint135="{ item }">
        <!-- <router-link to="">
          {{ item.preprint135 }}
          <v-icon color="primary" class="ml-7"> mdi-file-document </v-icon>
        </router-link> -->
        <v-icon
          color="primary"
          class="ml-5"
          @click="create135(item, 'arrivals')"
        >
          mdi-file-document
        </v-icon>
      </template>
      <template v-slot:item.cdcrNumber="{ item }">
        <router-link
          :to="{
            name: 'Transfer Details',
            params: { cdcrNumber: item.cdcrNumber },
          }"
          @click.native="updateSelected(item)"
          >{{ item.cdcrNumber }}</router-link
        >
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import { get, sync } from 'vuex-pathify';
  import departuresArrivalsSvc from '@/feathers/services/departuresarrivals/departuresarrivals.service.js';
  import pdfMake from 'pdfmake/build/pdfmake';
  import pdfFonts from 'pdfmake/build/vfs_fonts';
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  export default {
    name: 'Home',
    data: () => ({
      selDeparture: [],
      selArrival: [],
      itemsPerPage: 5,
      loading: false,
      departureSearch: '',
      arrivalSearch: '',
      departures: [],
      arrivals: [],
      departureHeaders: [
        {
          text: 'CDCR Number',
          align: 'start',
          value: 'cdcrNumber',
        },
        { text: 'Schedule', value: 'title' },
        { text: 'Name', value: 'fullName' },
        { text: 'Destination', value: 'destination' },
        { text: 'VIAs', value: 'vias' },
        { text: 'Transfer Reason', value: 'transferReasonCode' },
        { text: 'Endorsement Date', value: 'transferDate' },
        { text: 'Release Date', value: 'releaseDate' },
        { text: 'Print 135', value: 'print135' },
        // { text: 'Updates?', value: 'updates' },
      ],
      arrivalHeaders: [
        {
          text: 'CDCR Number',
          align: 'start',
          value: 'cdcrNumber',
        },
        { text: 'Schedule', value: 'title' },
        { text: 'Name', value: 'fullName' },
        { text: 'Transfer From', value: 'origin' },
        { text: 'VIAs', value: 'vias' },
        { text: 'Transfer Reason', value: 'transferReasonCode' },
        { text: 'Endorsement Date', value: 'transferDate' },
        { text: 'Release Date', value: 'releaseDate' },
        { text: 'Print 135', value: 'preprint135' },
      ],
    }),
    async mounted() {
      this.onChangeInstitution();
      //this.transfers = await this.readTransfers();
      // TODO: Get departures and arrivals by institition
      // const response = await departuresArrivalsSvc.find({
      //   query: {
      //     institution: this.selectedInstitution.institutionName,
      //   },
      // });
      // console.log('DEP ARR: ', response);
    },
    methods: {
      // ...call('schedules', ['readSchedulesByOrigin']),
      // ...call('transfers', ['readTransfersByInstitution']),

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
      async getDepartures() {
        let filter = {
          query: {
            $sort: {
              transferDate: 1,
            },
            // transferDate: {
            //   $gte: this.dateBegin,
            //   $lte: this.dateEnd,
            // },
          },
        };

        if (this.selectedInstitution) {
          filter.query.origin = this.selectedInstitution.institutionName;
        }
        try {
          // this.transfers = await this.readTransfers(filter);
          const response = await departuresArrivalsSvc.find(filter);
          console.log('getDepartures(): response => ', response);
          this.departures = response.data;
          console.log('getDepartures(): departures => ', this.departures);
          if (!response) {
            alert(
              'No Transfers found for institution: ',
              this.selectedInstitution
            );
            return;
          }
        } catch (ex) {
          console.error('getDepartures() exception: ', ex);
        }
      },
      async getArrivals() {
        let filter = {
          query: {
            $sort: {
              transferDate: 1,
            },
            // transferDate: {
            //   $gte: this.dateBegin,
            //   $lte: this.dateEnd,
            // },
          },
        };

        if (this.selectedInstitution) {
          filter.query.destination = this.getInstitutionId(
            this.selectedInstitution.institutionName
          );
        }
        try {
          // this.transfers = await this.readTransfers(filter);
          const response = await departuresArrivalsSvc.find(filter);
          console.log('getArrivals(): response => ', response);
          this.arrivals = response.data;
          console.log('getArrivals(): arrivals => ', this.arrivals);
          if (!response) {
            alert(
              'No Transfers found for institution: ',
              this.selectedInstitution
            );
            return;
          }
        } catch (ex) {
          console.error('getArrivals() exception: ', ex);
        }
      },
      /**
       * This method reads the schedule for the selected institution
       */
      /*       async readTransfers() {
         await this.readTransfersByInstitution(
           this.selectedInstitution.institutionName
         );
         // For each transfer at the institution
         this.transfers.forEach((offender) => {
           // Find their schedule...
           const schedule = this.schedules.find(
             (sch) => sch.schedule === offender.schedule
           );

           if (schedule) {
             // Departing
             // An offender is departing from the institution
             // if the schedule he/she is assigned to has a different origin
             if (schedule.origin === this.selectedInstitution.institutionName) {
               this.departingOffenders.push(offender);
             }

             // Arrivals
             // An offender is arriving if the schedules destination
             // is the selected institution
             // if (
             //   schedule.destination === this.selectedInstitution.institutionId
             // ) {
             //   this.arrivingOffenders.push(offender);
             // }
           }
         });
       },
  */
      // syncSOMS() {
      //   this.loading = true;
      //   setTimeout(() => {
      //     this.loading = false;
      //   }, 3000);
      // },
      onChangeInstitution() {
        this.getDepartures();
        this.getArrivals();
      },
      // searchOffender(){
      //   console.log("I don't work yet :)")
      // },
      // eslint-disable-next-line no-unused-vars
      filterTransfers(value, search, item) {
        return (
          value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search) !== -1
        );
      },
      // eslint-disable-next-line no-unused-vars
      filterOffenderArrivals(value, search, item) {
        return (
          value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search) !== -1
        );
      },
      convertDepartingDates() {
        this.departingOffenders.forEach((element) => {
          element.endorseDate
            ? (element.endorseDate = new Date(element.endorseDate)
                .toISOString()
                .split('T')[0])
            : null;
        });
        this.departingOffenders.forEach((element) => {
          element.releaseDate
            ? (element.releaseDate = new Date(element.releaseDate)
                .toISOString()
                .split('T')[0])
            : null;
        });
      },
      convertArrivingDates() {
        this.arrivingOffenders.forEach((element) => {
          element.endorseDate
            ? (element.endorseDate = new Date(element.endorseDate)
                .toISOString()
                .split('T')[0])
            : null;
        });
        this.arrivingOffenders.forEach((element) => {
          element.releaseDate
            ? (element.releaseDate = new Date(element.releaseDate)
                .toISOString()
                .split('T')[0])
            : null;
        });
      },
      updateSelected(selected) {
        console.log(selected);
        this.selTransferReason = {
          reasonCode: selected.TransferReasonCode,
          reasonDesc: selected.TransferReasonDesc,
        };
        this.selSchedule = [
          {
            origin: selected.origin,
            originId: selected.originId,
            destination: selected.destination,
            title: selected.title,
            vias: selected.vias,
            transferDate: selected.transferDate,
            seats: selected.seats,
          },
        ];
      },
      routeToDetails(item) {
        console.log('routeToDetails: item = ', item);
      },
      // create135()
      //
      async create135(item, group) {
        // let filter = {
        //   query: {
        //     $limit: 50,
        //     $sort: {
        //       transferDate: 1,
        //     },
        //   },
        // };

        // if (param == 'schedule' && this.sel135Schedule) {
        //   filter.query.title = this.sel135Schedule;
        // if (param == 'schedule' && this.selSchedule) {
        //   filter.query.scheduleId = this.selSchedule._id;
        // if (!this.schedule) {
        //   alert('Selected schedule = ', this.schedule);
        //   return;
        // }
        // this.readTransfersBySchedule(filter);
        // } else if (param == 'cdcrNumber' && this.cdcrNum) {
        // if (item.cdcrNumber) {
        //   let today = new Date().toISOString().split('T')[0];
        //   filter.query.cdcrNumber = this.cdcrNum;
        //   filter.query.transferDate = { $gte: today };
        //   // this.readTransfersBySchedule(filter);
        // } else {
        //   alert('Invalid option for CDCR-135 Transfer Record.');
        //   return;
        // }

        // try {
        //   console.log('create135(): filter => ', filter);
        //   this.transfers = await this.readTransfers(filter);
        //   console.log('create135(): transfers => ', this.transfers);
        //   if (!this.transfers) {
        //     alert('No Transfers found for schedule: ', this.schedule.title);
        //     return;
        //   }
        // } catch (ex) {
        //   console.error('create135() exception: ', ex);
        // }

        let items = [];
        if (item) {
          items.push(item);
        } else {
          if (group === 'departures') {
            items = this.departures;
          } else if (group === 'arrivals') {
            items = this.arrivals;
          }
        }
        let data = [];
        // let row = [];
        const obj = {
          text: '',
          style: 'tblData',
          border: [false, false, false, false],
        };
        let num = 1;
        for (let xfr of items) {
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
          this.create135PDF(data, items);
        } else {
          // error message
          alert('Could not create CDCR 135 PDF Document!');
        }
      },
      // create135PDF()
      //
      create135PDF(data, items) {
        console.log('create135PDF(): data => ', data);

        // const fileName = this.fileName + '.pdf';
        const stateOf = 'STATE OF CALIFORNIA';
        const agency = 'DEPARTMENT OF CORRECTIONS AND REHABILITATION';
        const report135 = 'CDCR 135 (Rev. 03/06)';

        const doc = `${stateOf}\n${report135}\nDISTRIBUTION PER INSTITUTION POLICY`;
        const reportTitle = 'TRANSFER RECORD';

        let dtLabel =
          'The following identified persons will be transferred this date';
        let xfrNum = items.length;
        let title = items[0].title;
        let from = items[0].destination;
        let to = this.getInstitutionId(items[0].origin);
        let vias = items[0].vias;
        let xfrDate = items[0].transferDate;

        let today = Date.now();
        let fileName = '';
        if (items.length === 1) {
          fileName = `135_${items[0].cdcrNumber}_${today}.pdf`;
        } else {
          fileName = `135_${items[0].title}_${today}.pdf`;
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
    },
    computed: {
      ...sync('transfers', ['transfers', 'selTransferReason']),
      ...sync('schedules', ['schedules', 'selSchedule']),
      ...sync('institutions', ['selectedInstitution']),
      ...get('institutions', ['listOfInstitutions']),
      ...get('users', ['loggedInUser']),
      appUserRoles() {
        return this.$store.get('users/getAppUserRoles');
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
