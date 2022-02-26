<template>
  <v-card flat class="mb-12" v-bind="$attrs">
    <TransferSearch v-model="somsCDCRNumber" />

    <!-- Progress Loader -->
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      color="primary"
    ></v-progress-linear>

    <v-card-text class="pa-2 mx-2" v-if="somsOffender">
      <!-- Transfer Header -->
      <TransferHeader class="mr-2" />

      <v-divider></v-divider>

      <!-- Transfer Panel -->
      <TransferPanel class="mr-2" />

      <!-- Holds Table -->
      <TransferHoldsTable class="mr-2" />
    </v-card-text>
  </v-card>
</template>

<script>
  import { get, call, sync } from 'vuex-pathify';
  import TransferSearch from '@/components/Transfer/TransferSearch.vue';
  import TransferHeader from '@/components/Transfer/TransferHeader.vue';
  import TransferPanel from '@/components/Transfer/TransferPanel.vue';
  import TransferHoldsTable from '@/components/Transfer/TransferHoldsTable.vue';
  // import { setSnackbar } from '@/helpers/snackbar.js';

  export default {
    name: 'TransferDetails',
    props: {
      cdcrNumber: {
        type: String,
        default: 'new',
      },
    },
    components: {
      TransferHeader,
      TransferSearch,
      TransferPanel,
      TransferHoldsTable,
    },
    data: () => ({
      somsCDCRNumber: '',
    }),
    async created() {
      console.log('created()');
      if (this.$route && this.$route.params && this.$route.params.cdcrNumber) {
        this.somsCDCRNumber = this.$route.params.cdcrNumber;
        console.log(
          'TransferDetails:created(): this.somsCDCRNumber => ',
          this.somsCDCRNumber
        );
        try {
          await this.readOffenderDetails(this.somsCDCRNumber);
        } catch (ex) {
          console.log(
            'TransferDetails.vue:created(): readOffenderDetails() exception => ',
            ex
          );
        }

        try {
          const queryObj = {
            query: {
              cdcrNumber: this.somsCDCRNumber,
            },
          };
          console.log('created(): queryObj => ', { queryObj });
          const [responseData] = await this.readTransfers(queryObj);
          console.log('created(): responseData => ', responseData);
          if (responseData) {
            this.transferData._id = responseData._id;
            this.transferData.scheduleId = responseData.scheduleId;
            this.transferData.isScheduled = responseData.isScheduled;
            this.transferData.transferReasonCode =
              responseData.transferReasonCode &&
              this.transferData.transferReasonCode !=
                responseData.transferReasonCode
                ? responseData.transferReasonCode
                : this.transferData.transferReasonCode;
            this.transferData.transferReasonDesc =
              responseData.transferReasonDesc &&
              this.transferData.transferReasonDesc !=
                responseData.transferReasonDesc
                ? responseData.transferReasonDesc
                : this.transferData.transferReasonDesc;
            this.transferData.comments = responseData.comments;
            this.transferData.inHouseRemarks = responseData.inHouseRemarks;
            this.transferData.endorsedToName = responseData.endorsedToName;
            this.transferData.endorsedToId = responseData.endorsedToId;
            this.transferData.endorsedToPartyId =
              responseData.endorsedToPartyId;
          } else {
            console.log('getInstitutionByName()');
            const institution = this.getInstitutionByName(
              this.somsOffender.institution
            );
            if (institution && !institution._notindb) {
              console.log(
                'getInstitutionByName(): institution => ',
                institution
              );
              this.transferData.endorsedToName = institution.institutionName;
              this.transferData.endorsedToId = institution.institutionId;
              this.transferData.endorsedToPartyId =
                institution.institutionPartyId;
            }
            this.setSnackbar(
              `No record has been saved yet for cdcr number: ${this.somsCDCRNumber}`,
              'info',
              3000
            );
          }
          console.log('created(): this.transferData => ', this.transferData);
          this.selTransferReason = {
            reasonCode: this.transferData.transferReasonCode,
            reasonDesc: this.transferData.transferReasonDesc,
          };
        } catch (ex) {
          console.log(
            'TransferDetails.vue:created():readTransfers() exception => ',
            ex
          );
        }

        try {
          console.log('TransferDetails.vue:created(): readSchedules()');
          const respSchedules = await this.readSchedules({
            query: {
              origin:
                this.somsOffender && this.somsOffender.institutionName
                  ? this.somsOffender.institutionName
                  : '',
            },
          });
          console.log('created(): responseData => ', respSchedules);
          if (respSchedules && this.transferData.scheduleId) {
            console.log(
              'TransferDetails.vue:created(): this.transferData.scheduleId => ',
              this.transferData.scheduleId
            );
            console.log(
              'TransferDetails.vue:created(): respSchedules => ',
              respSchedules
            );

            for (let schedule of respSchedules) {
              console.log(
                'TransferDetails.vue:created(): schedule._id => ',
                schedule._id
              );
              if (this.transferData.scheduleId == schedule._id) {
                this.selSchedule = schedule;
                break;
              }
            }
          }
        } catch (ex) {
          console.log(
            'TransferDetails.vue->created()->readSchedules() exception => ',
            ex
          );
        }
      }
    },
    computed: {
      ...sync('transfers', ['transferData', 'selTransferReason']),
      ...sync('schedules', ['selSchedule']),
      ...get('app', ['loading']),
      ...get('institutions', ['listOfInstitutions', 'getInstitutionByName']),
      // ...get('schedules', ['selSchedule']),
      ...get('transfers', ['somsOffender']),
    },
    methods: {
      ...call('app', ['SET_ALERT', 'SET_SNACKBAR']),
      ...call('transfers', ['readOffenderDetails', 'readTransfers']),
      ...call('schedules', ['readSchedules']),
      setSnackbar(msg, result, timeout) {
        this.SET_SNACKBAR({
          top: true,
          center: true,
          message: msg,
          color: result,
          timeout: timeout,
        });
      },
    },
  };
</script>
