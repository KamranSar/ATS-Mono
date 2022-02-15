<template>
  <v-card flat class="mb-12">
    <v-card-title class="blue-grey lighten-4">
      <v-row>
        <v-col cols="4" xs="12" md="4" class="py-1" align-self="center">
          <h2>Endorsements</h2>
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
        <v-col align="right" align-self="center">
          <v-icon small color="primary" right>mdi-arrow-left</v-icon>
          <a class="text-decoration-none subtitle-2" @click="goHome">
            Back to Home
          </a>
        </v-col>
      </v-row>
    </v-card-title>
    <!-- <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      color="primary"
    ></v-progress-linear> -->
    <v-data-table
      ref="myTable"
      :items-per-page="itemsPerPage"
      dense
      :headers="Headers"
      :items="endorsements"
      item-key="cdcrNumber"
      class="elevation-1 ma-4 pa-4"
      @keypress="filterEndorsements"
      :loading="loading"
      show-select
      loading-text="Syncing Data with SOMS... Please wait"
      no-data-text="No Endorsements"
      no-results-text="No Endorsements Found"
    >
      <template v-slot:top>
        <v-row>
          <v-col cols="4">
            <v-text-field
              dense
              v-model="endorsementSearch"
              label="Search Endorsements"
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
        >
          {{ item.cdcrNumber }}
        </router-link>
        <!-- <a href="" @click="createPDF()">
          {{ item.cdcrNumber }}
        </a> -->
      </template>
      <template v-slot:item.fullName="{ item }">
        <span>{{ item.firstName }}, {{ item.lastName }}</span>
      </template>
      <template v-slot:item.endorsedTo="{ item }">
        <span>{{ getInstitutionId(item.endorseInstitution) }}</span>
      </template>
      <template v-slot:item.level="{ item }">
        <span>{{ setSecurityLevel(item) }}</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import endorsedOffenders from '@/feathers/services/offender/endorsed.service.js';
  import { get, sync } from 'vuex-pathify';
  import pdfMake from 'pdfmake/build/pdfmake';
  import pdfFonts from 'pdfmake/build/vfs_fonts';
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  import jsPDF from 'jspdf';
  import 'jspdf-autotable';

  export default {
    name: 'Endorsements',
    data: () => ({
      selEndorsement: [],
      itemsPerPage: 10,
      loading: false,
      endorsementSearch: '',
      endorsements: [],
      Headers: [
        {
          text: 'CDCR #',
          align: 'start',
          value: 'cdcrNumber',
        },
        { text: 'Name', value: 'fullName' },
        { text: 'Endorsed To', value: 'endorsedTo' },
        { text: 'Level', value: 'level' },
        { text: 'Endorsed Date', value: 'endorseDate' },
        { text: 'Expired Date', value: 'expirationDate' },
        { text: 'Release Date', value: 'releaseDate' },
        { text: 'Case Factor', value: 'caseFactor' },
        { text: 'Ethnicity', value: 'ethnicity' },
        { text: 'Housing', value: 'housingArea' },
        { text: 'In House Remarks', value: 'inHouseRemarks' },
      ],
      SampleData: [
        {
          cdcrNumber: 'AY4411',
          firstName: 'JOSE',
          lastName: 'LERMA',
          endorsedTo: 'CAC',
          securityLevel: 'II',
          originalEndorsementDate: '01/07/22',
          releaseDate: '2030-06-23',
          caseFactor: '',
          ethnicity: 'HIS',
          housingArea: 'A 003 2221001UP',
          inHouseRemarks: 'CAC-II, EXPIRES 07/06/22 CS=33 NO HR, CWRS=0, VAX',
        },
        {
          cdcrNumber: 'BH5119',
          firstName: '',
          lastName: 'DAVIS',
          endorsedTo: 'CAL',
          securityLevel: 'IV',
          originalEndorsementDate: '12/10/21',
          releaseDate: '2026-09-20',
          caseFactor: '270',
          ethnicity: 'BLA',
          housingArea: 'A 003 2203001UP',
          inHouseRemarks:
            'CALC-IV(270), EXPIRES 06/08/22 CS=66 NO HR, CWRS=0, UNVAX',
        },
        {
          cdcrNumber: 'AY4940',
          firstName: 'MIGUEL',
          lastName: 'JIMENEZ',
          endorsedTo: 'CAL',
          securityLevel: 'IV',
          originalEndorsementDate: '01/13/22',
          releaseDate: '2032-02-10',
          caseFactor: '',
          ethnicity: 'HIS',
          housingArea: 'A 010 2221001LP',
          inHouseRemarks:
            'CAL-IV, EXPIRES 07/12/22 CS=64, ASU LOS 44 NO HR, CWRS=0, VAX',
        },
        {
          cdcrNumber: 'BF5834',
          firstName: 'RICHARD',
          lastName: 'RAY',
          endorsedTo: 'CCC',
          securityLevel: 'III',
          originalEndorsementDate: '01/07/22',
          releaseDate: '2026-01-21',
          caseFactor: '',
          ethnicity: 'HIS',
          housingArea: 'B 010 1118001LP',
          inHouseRemarks: 'CCC-III, OTC ONLY NCD 03-21-22',
        },
        {
          cdcrNumber: 'BH1236',
          firstName: 'THEO',
          lastName: 'COBBS',
          endorsedTo: 'CEN',
          securityLevel: 'III',
          originalEndorsementDate: '12/24/21',
          releaseDate: '2024-11-09',
          caseFactor: '',
          ethnicity: 'BLA',
          housingArea: 'C 014 1003002UP',
          inHouseRemarks:
            'CEN-II, EXPIRES 06/22/22 CS=39 DNH, DLT, LB, GF, CWRS=4, UNVAX',
        },
        {
          cdcrNumber: 'F85942',
          firstName: 'FERNANDO',
          lastName: 'OCEGUERA',
          endorsedTo: 'CEN',
          securityLevel: 'IV',
          originalEndorsementDate: '01/04/22',
          releaseDate: '2025-09-08',
          caseFactor: '270, DLT,',
          ethnicity: 'HIS',
          housingArea: 'A 006 1131001LP',
          inHouseRemarks:
            'CEN-IV(270), EXPIRES 07/03/22 CS=74 DNH, DLT, LB, GF, CWRS=4, VAX',
        },
        {
          cdcrNumber: 'AB8856',
          firstName: 'DANIEL',
          lastName: 'DIAZ',
          endorsedTo: 'CEN',
          securityLevel: 'IV',
          originalEndorsementDate: '01/14/22',
          releaseDate: '2024-05-07',
          caseFactor: '270',
          ethnicity: 'HIS',
          housingArea: 'A 004 2206001LP',
          inHouseRemarks: 'CEN-IV, EXPIRES 07/13/22 CS=33 NO HR, CWRS=0, VAX',
        },
        {
          cdcrNumber: 'BL0492',
          firstName: 'CARL',
          lastName: 'NELSON',
          endorsedTo: 'CHCF',
          securityLevel: 'II',
          originalEndorsementDate: '01/19/22',
          releaseDate: '2029-06-28',
          caseFactor: 'NDPF',
          ethnicity: 'WHI',
          housingArea: 'B 012 2222001UP',
          inHouseRemarks:
            'CHCF-II(NDPF), EXPIRES 07/18/22 CS=31 NO HR, CWRS=7, VAX',
        },
        {
          cdcrNumber: 'BL1745',
          firstName: 'ROBERT',
          lastName: 'MANSON',
          endorsedTo: 'CIM',
          securityLevel: 'I',
          originalEndorsementDate: '01/12/22',
          releaseDate: '2022-09-19',
          caseFactor: 'SEC, NDPF',
          ethnicity: 'BLA',
          housingArea: 'D 022 2014005UP',
          inHouseRemarks:
            'CIM-I(SEC/NDPF), EXPIRES 07/11/22 CS=8 NO HR, CWRS=2, VAX',
        },
        {
          cdcrNumber: 'AY4924',
          firstName: 'MICHAEL',
          lastName: 'JOHNSON',
          endorsedTo: 'CIM',
          securityLevel: 'I',
          originalEndorsementDate: '01/19/22',
          releaseDate: '2030-02-17',
          caseFactor: 'SEC, NDPF',
          ethnicity: 'BLA',
          housingArea: 'A 024 1000143LP',
          inHouseRemarks:
            'CIM-I(SEC, NDPF), EXPIRES 07/18/22 CS=15 LB, CWRS=10, VAX',
        },
      ],
    }),
    async mounted() {
      this.onChangeInstitution();
      this.getEndorsements();
    },
    methods: {
      goHome() {
        this.$router.push({
          name: 'Home',
        });
      },
      setSecurityLevel(item) {
        return item.endoreSecurityLevel !== 'NA'
          ? item.endoreSecurityLevel
          : item.securityLevel;
      },
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
      async getEndorsements() {
        this.loading = true;
        let filter = {
          query: {
            $limit: 500,
            // $sort: {
            //   endorsedDate: 1,
            // },
          },
        };

        if (this.selectedInstitution) {
          filter.query.institutionId =
            this.selectedInstitution.institutionPartyId;
          filter.query.endorseInstitution = {
            $ne: this.selectedInstitution.institutionName,
          };
        }
        try {
          const response = await endorsedOffenders.find(filter);
          console.log('getEndorsements(): response => ', response);
          // const response = await departuresArrivalsSvc.find(filter);
          // console.log('getEndorsements(): response => ', response);
          if (response && response.data) {
            this.endorsements = response.data;
            console.log(
              'getEndorsements(): endorsements => ',
              this.endorsements
            );
          } else {
            this.loading = false;
            alert(
              'No Endorsements found for institution: ',
              this.selectedInstitution
            );
            return;
          }
        } catch (ex) {
          console.error('getEndorsements() exception: ', ex);
        }
        this.loading = false;
      },
      onChangeInstitution() {
        this.getEndorsements();
      },
      searchEndorsements() {},
      // eslint-disable-next-line no-unused-vars
      filterEndorsements(value, searchData, item) {
        return (
          value != null &&
          searchData != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(searchData) !== -1
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
      updateSelected(selected) {
        console.log(selected);
        this.selTransferReason = {
          reasonCode: selected.TransferReasonCode,
          reasonDesc: selected.TransferReasonDesc,
        };
        this.selSchedule = {
          origin: selected.origin,
          originId: selected.originId,
          destination: selected.destination,
          title: selected.title,
          vias: selected.vias,
          transferDate: selected.transferDate,
          seats: selected.seats,
        };
      },
      createPDF() {
        const source = this.$refs['myTable'];
        let rows = [];
        let columnHeader = [
          'CDCR #',
          'Name',
          'Endorsed To',
          'Level',
          'Endorsed Date',
          'Release Date',
          'Case Factor',
          'Ethnicity',
          'Housing',
          'In House Remarks',
        ];
        let pdfName = 'endorsements';
        source.items.forEach((element) => {
          const temp = [
            element.cdcrNumber,
            element.lastName + ', ' + element.firstName,
            element.endorsedTo,
            element.securityLevel,
            element.originalEndorsementDate,
            element.releaseDate,
            element.caseFactor,
            element.ethnicity,
            element.housingArea,
            element.inHouseRemarks,
          ];
          rows.push(temp);
        });
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'in',
          format: [22, 17],
        });
        doc.autoTable(columnHeader, rows);
        doc.save(pdfName + '.pdf');
      },
    },
    computed: {
      ...sync('transfers', ['transfers', 'selTransferReason']),
      ...sync('institutions', ['selectedInstitution']),
      ...get('institutions', ['listOfInstitutions']),
      ...get('users', ['loggedInUser']),
      appUserRoles() {
        return this.$store.get('users/getAppUserRoles');
      },
    },
  };
  //@click.native="updateSelected(item)"
</script>

<style scoped>
  .selInstitution {
    background-color: white;
    border-radius: 5px;
  }
</style>
