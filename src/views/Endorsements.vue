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
      :search="endorsementSearch"
      :items-per-page="itemsPerPage"
      dense
      :headers="Headers"
      :items="endorsements"
      item-key="cdcrNumber"
      class="elevation-1 ma-4 pa-4"
      @keypress="filterEndorsements"
      :loading="loading"
      :options="dataOptions"
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
      </template>
      <template v-slot:item.endorsedTo="{ item }">
        <span>{{
          getInstitutionByName(item.endorseInstitution).institutionId +
          '/' +
          item.endorseProgram
        }}</span>
      </template>
      <template v-slot:item.endorseDate="{ item }">
        <span class="nowrap">{{ formatDate(item.endorseDate) }}</span>
      </template>
      <template v-slot:item.expirationDate="{ item }">
        <span class="nowrap">{{ formatDate(item.expirationDate) }}</span>
      </template>
      <template v-slot:item.releaseDate="{ item }">
        <span class="nowrap">{{ formatDate(item.releaseDate) }}</span>
      </template>
      <template v-slot:item.caseFactor="{ item }">
        <span>{{ formatCaseFactors(item) }}</span>
      </template>
      <template v-slot:item.inHouseRemarks="{ item }">
        <v-btn icon @click.stop="openRemarks(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="dlgRemarks" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          In-House Remarks
        </v-card-title>

        <v-card-text>
          <v-textarea v-model="remarks" />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cancelRemarks()">CANCEL</v-btn>
          <v-btn color="primary" text @click="saveRemarks()">SAVE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import endorsedOffenders from '@/feathers/services/offender/endorsed.service.js';
  import { get, call, sync } from 'vuex-pathify';
  import pdfMake from 'pdfmake/build/pdfmake';
  import pdfFonts from 'pdfmake/build/vfs_fonts';
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  export default {
    name: 'Endorsements',
    data: () => ({
      remarks: '',
      dlgRemarks: false,
      selEndorsement: null,
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
        { text: 'Last Name', value: 'lastName' },
        { text: 'First Name', value: 'firstName' },
        { text: 'Level', value: 'securityLevel' },
        { text: 'Endorsed To/Level', value: 'endorsedTo' },
        { text: 'Endorsed Date', value: 'endorseDate' },
        { text: 'Expired Date', value: 'expirationDate' },
        { text: 'Release Date', value: 'releaseDate' },
        { text: 'Case Factor', value: 'caseFactor' },
        { text: 'Ethnicity', value: 'ethnicity' },
        { text: 'Housing', value: 'housingArea' },
        { text: 'In House Remarks', value: 'inHouseRemarks' },
      ],
      dataOptions: {
        // page: number,
        // itemsPerPage: number,
        sortBy: ['endorseDate'],
        // sortDesc: boolean[],
        // groupBy: string[],
        // groupDesc: boolean[],
        // multiSort: boolean,
        // mustSort: boolean
      },
      snackbarOptions: {
        top: true,
        center: true,
        message: '',
        color: '',
        timeout: 6000,
      },
    }),
    async mounted() {
      this.onChangeInstitution();
      this.getEndorsements();
    },
    methods: {
      ...call('app', ['SET_SNACKBAR']),
      ...call('transfers', [
        'readTransfers',
        'readOffenderDetails',
        'saveForm',
      ]),
      setSnackbar(msg, result, timeout) {
        this.SET_SNACKBAR({
          top: true,
          center: true,
          message: msg,
          color: result,
          timeout: timeout,
        });
      },
      async openRemarks(item) {
        if (!item) {
          // TODO add message
          this.dlgRemarks = false;
          return;
        }
        this.selEndorsement = item;
        this.dlgRemarks = true;

        console.log('openRemarks(): item =>', item);

        try {
          let filter = {
            query: {
              cdcrNumber: item.cdcrNumber,
            },
          };
          console.log('openRemarks(): filter =>', filter);
          let response = await this.readTransfers(filter);
          if (response && response.length > 0) {
            console.log(
              'openRemarks(): readTransfers(): response => ',
              response
            );
            this.transferData = response[0];
            this.remarks = this.transferData.inHouseRemarks;
            console.log('openRemarks(): transferData =>', this.transferData);
          } else {
            console.log('openRemarks(): readOffenderDetails()');
            await this.readOffenderDetails(item.cdcrNumber);
            console.log(
              'openRemarks(): this.transferData => ',
              this.transferData
            );
          }
        } catch (ex) {
          // setSnackbar error
          console.error(ex);
        }
      },
      cancelRemarks() {
        console.log('cancelRemarks()');
        this.dlgRemarks = false;
        this.selEndorsement = null;
        this.transferData = null;
        this.remarks = '';
      },
      async saveRemarks() {
        console.log('saveRemarks(): transferData => ', this.transferData);
        // console.log(
        //   'saveRemarks(): transferData.inHouseRemarks',
        //   this.transferData.inHouseRemarks
        // );
        console.log('saveRemarks(): remarks => ', this.remarks);

        // if (
        //   !this.transferData &&
        //   this.remarks !== this.transferData.inHouseRemarks
        // ) {
        try {
          console.log('saveRemarks(): this.remarks => ', this.remarks);
          console.log(
            'saveRemarks(): this.transferData.inHouseRemarks => ',
            this.transferData.inHouseRemarks
          );
          this.transferData.inHouseRemarks = this.remarks;

          console.log(
            'saveRemarks(): this.transferData.institutionName => ',
            this.transferData.institutionName
          );
          let objIns = this.listOfInstitutions.find(
            (inst) =>
              this.transferData &&
              this.transferData.institutionName &&
              inst.institutionName === this.transferData.institutionName
          );
          console.log('saveRemarks(): objIns => ', objIns);
          if (!this.transferData.institutionName) {
            this.transferData.institutionName = objIns.institutionName;
          }
          if (!this.transferData.institutionId) {
            this.transferData.institutionId = objIns.institutionId;
          }
          if (!this.transferData.institutionPartyId) {
            this.transferData.institutionPartyId = objIns.institutionPartyId;
          }

          objIns = this.listOfInstitutions.find(
            (inst) =>
              this.transferData &&
              this.transferData.endorsedToName &&
              inst.institutionName === this.transferData.endorsedToName
          );
          console.log('saveRemarks(): objIns => ', objIns);
          if (!this.transferData.endorsedToName) {
            this.transferData.endorsedToName = objIns.institutionName;
          }
          if (!this.transferData.endorsedToId) {
            this.transferData.endorsedToId = objIns.institutionId;
          }
          if (!this.transferData.endorsedToPartyId) {
            this.transferData.endorsedToPartyId = objIns.institutionPartyId;
          }

          const response = await this.saveForm();

          if (response) {
            // setSnackbar successful
            this.setSnackbar('Successfully saved remarks!', 'succesful', 2000);
          } else {
            // setSnackbar error
            this.setSnackbar('Error saving remarks!', 'error', 6000);
          }
        } catch (ex) {
          // setSnackbar error
          console.error(ex);
          this.setSnackbar('Error occurred saving remarks!', 'error', 6000);
        }
        // } else {
        //   this.setSnackbar('Remarks did not change.', 'info', 2000);
        // }
        this.cancelRemarks();
      },
      goHome() {
        this.$router.push({
          name: 'Home',
        });
      },
      setSecurityLevel(item) {
        return item.endorseSecurityLevel !== 'NA'
          ? item.endorseSecurityLevel
          : item.securityLevel;
      },
      formatDate(item) {
        // 0123/56/78
        const y = item.substr(2, 2);
        const m = item.substr(5, 2);
        const d = item.substr(8, 2);
        const result = m + '/' + d + '/' + y;
        return result;
      },
      formatCaseFactors(item) {
        console.log('formatCaseFactors(): item => ', item);
        const cf = [];
        if (item.lifer_lwop_flag) {
          cf.push(item.sny_value);
        }
        if (item.sny_flag) {
          cf.push(item.sny_value);
        }
        if (item.cccms_eop_flag) {
          cf.push('ccms-eop: ' + item.cccms_eop_value);
        }
        if (item.cocci1_flag) {
          cf.push('cocci1: ' + item.cocci1_value);
        }
        if (item.cocci2_flag) {
          cf.push('cocci2: ' + item.cocci2_value);
        }
        if (item.ddp_flag) {
          cf.push(item.ddp_value);
        }
        if (item.dpp_flag) {
          cf.push(item.dpp_value);
        }
        if (item.ice_flag) {
          cf.push('ice: ' + item.ice_value);
        }
        if (item.retainASU_flag) {
          cf.push(item.retainASU_value);
        }
        if (item.transferMERD_flag) {
          cf.push(item.transferMERD_value);
        }
        return cf.join(', ');
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
        } else {
          this.setSnackbar(
            'Please select an institution and try again.',
            'info',
            3000
          );
          return;
        }
        try {
          this.loading = true;
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

      // createPDF() {
      //   const source = this.$refs['myTable'];
      //   let rows = [];
      //   let columnHeader = [
      //     'CDCR #',
      //     'Name',
      //     'Endorsed To',
      //     'Level',
      //     'Endorsed Date',
      //     'Release Date',
      //     'Case Factor',
      //     'Ethnicity',
      //     'Housing',
      //     'In House Remarks',
      //   ];
      //   let pdfName = 'endorsements';
      //   source.items.forEach((element) => {
      //     const temp = [
      //       element.cdcrNumber,
      //       element.lastName + ', ' + element.firstName,
      //       element.endorsedTo,
      //       element.securityLevel,
      //       element.originalEndorsementDate,
      //       element.releaseDate,
      //       element.caseFactor,
      //       element.ethnicity,
      //       element.housingArea,
      //       element.inHouseRemarks,
      //     ];
      //     rows.push(temp);
      //   });
      //   const doc = new jsPDF({
      //     orientation: 'landscape',
      //     unit: 'in',
      //     format: [22, 17],
      //   });
      //   doc.autoTable(columnHeader, rows);
      //   doc.save(pdfName + '.pdf');
      // },
    },
    computed: {
      ...sync('transfers', ['transfers', 'selTransferReason', 'transferData']),
      ...sync('institutions', ['selectedInstitution']),
      ...get('institutions', [
        'listOfInstitutions',
        'getInstitutionByName',
        'getInstitutionById',
      ]),
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
  .nowrap {
    white-space: nowrap;
  }
</style>
