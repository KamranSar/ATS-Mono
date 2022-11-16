<template>
  <v-row class="my-0">
    <!-- Data/Photo/Housing... Column -->
    <v-col cols="3" sm="6" md="3" lg="3" class="pb-0 mb-0">
      <!-- Data -->
      <div v-show="showSOMSData">
        <span>Persons Information</span>
        <v-divider class="pb-2"></v-divider>
        <template v-for="(field, index) in SOMS_DATA_FIELDS">
          <v-divider :key="index" v-if="field.divider" class="pb-2"></v-divider>
          <template v-else>
            <span :key="'label-' + index" class="font-weight-bold pr-4">
              {{ field.label }}
            </span>
            <span :key="'data-' + index" class="float-right">
              {{ field.data }}
            </span>
            <br :key="'break-' + index" />
          </template>
        </template>
      </div>

      <!-- Photo -->
      <div v-show="showPhoto" class="photo-lg">
        <offender-image class="white--text" :somsOffender="somsOffender">
        </offender-image>
      </div>

      <!-- Housing -->
      <div v-show="showHousing">
        <span>Housing Restrictions</span>
        <v-divider class="pb-2"></v-divider>
        <ul>
          <li
            v-for="item in somsOffender.HousingRestrictions"
            :key="item.housingRestriction"
          >
            {{ item.housingRestrictionDescription }}
          </li>
        </ul>
      </div>

      <!-- Physical -->
      <div v-show="showPhysical">
        <span>Physical Limitations</span>
        <v-divider class="pb-2"></v-divider>
        <ul>
          <li
            v-for="item in somsOffender.PhysicalLimitations"
            :key="item.physicalLimitation"
          >
            {{ item.physicalLimitationDescription }}
          </li>
        </ul>
      </div>

      <!-- Medical -->
      <div v-show="showMedical">
        <span>Durable Medical Equipment</span>
        <v-divider class="pb-2"></v-divider>
        <ul>
          <li
            v-for="item in somsOffender.MedicalEquipment"
            :key="item.medicalEquipment"
          >
            {{ item.medicalEquipmentDescription }}
          </li>
        </ul>
      </div>

      <!-- Comments -->
      <div v-show="showComments">
        <span>Comments</span>
        <template v-for="(comment, index) in COMMENT_FIELDS">
          <v-divider
            v-if="comment.divider"
            :key="'divider-' + index"
            class="pb-1"
          ></v-divider>
          <v-textarea
            v-else
            :key="'textarea-' + index"
            :label="comment.label"
            v-model="comment.data"
            outlined
            no-resize
            rows="8"
            dense
            readonly
          ></v-textarea>
        </template>
      </div>
    </v-col>

    <!-- Case Factors Column -->
    <v-col cols="3" sm="6" md="3" lg="3" class="pb-0 mb-0">
      <div>
        <span>Case Factors</span>
        <v-divider class="pb-2"></v-divider>
        <table width="100%">
          <tr>
            <td class="font-size-sm pr-4">Case Factor</td>
            <td class="float-right">Yes/No/Value</td>
          </tr>
          <tr v-for="(caseFactor, index) in CASE_FACTOR_FIELDS" :key="index">
            <td class="font-weight-bold pr-4">{{ caseFactor.label }}</td>
            <!-- <td>
              {{ caseFactor.value }}
            </td> -->
            <td class="float-right">
              {{ caseFactor.data }}
            </td>
          </tr>
        </table>
      </div>
    </v-col>

    <!-- Endorsement Column -->
    <v-col cols="3" sm="6" md="3" lg="3" class="pb-0 mb-0">
      <span>Endorsement Information</span>
      <v-divider class="pb-2"></v-divider>
      <table width="100%">
        <tr v-for="(field, index) in ENDORSEMENT_FIELDS" :key="index">
          <td
            :key="'label-' + index"
            class="font-weight-bold pr-4"
            style="white-space: nowrap"
          >
            {{ field.label }}
          </td>
          <td style="text-align: right">
            <span
              :key="'data-' + index"
              style="
                overflow: hidden;
                text-align: right;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
              {{ field.data }}
            </span>
          </td>
        </tr>
      </table>
      <v-divider class="pb-2"></v-divider>
      <v-textarea
        v-model="transferData.inHouseRemarks"
        label="In-House Remarks"
        outlined
        no-resize
        rows="3"
        dense
        @blur="updateComments"
      ></v-textarea>
    </v-col>

    <!-- Schedule Column -->
    <v-col cols="3" sm="6" md="3" lg="3" class="pb-0 mb-0">
      <span>Schedule Information</span>
      <v-divider class="pb-2"></v-divider>
      <span>
        <v-select
          label="Schedule"
          v-model="selSchedule"
          :items="schedules"
          item-text="title"
          item-value="title"
          no-data-text="No schedules to display"
          return-object
          class="my-2 pl-1"
          clearable
          hide-details="true"
          dense
          @change="scheduleSelected"
        ></v-select>
      </span>
      <span class="font-weight-bold pr-4">Destination: </span>
      <span class="float-right" v-if="selSchedule && selSchedule.destination">
        {{ selSchedule.destination }}
      </span>
      <br />
      <span class="font-weight-bold pr-4">Vias: </span>
      <span class="float-right" v-if="selSchedule && selSchedule.vias">
        {{ selSchedule.vias.join(',') }}
      </span>
      <br />
      <span class="font-weight-bold pr-4">Transfer Date: </span>
      <span class="float-right" v-if="selSchedule && selSchedule.transferDate">
        {{ selSchedule.transferDate }}
      </span>
      <span class="mt-4">
        <v-select
          label="Specific Transfer Reason"
          v-model="selTransferReason"
          return-object
          :items="reasons"
          item-text="reasonDesc"
          item-value="reasonCode"
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
      </span>
      <v-divider class="pb-2"></v-divider>
      <v-textarea
        v-model="transferData.comments"
        label="CDCR 135/Status Report Comments"
        outlined
        no-resize
        rows="3"
        dense
        @blur="updateComments"
      ></v-textarea>
    </v-col>
  </v-row>
</template>
<script>
  import OffenderImage from '@/components/OffenderImage.vue';
  import { sync, get } from 'vuex-pathify';
  import { userplaceholder } from '@/assets/userplaceholder.js';
  import {
    SOMS_DATA_FIELDS,
    COMMENT_FIELDS,
    CASE_FACTOR_FIELDS,
    ENDORSEMENT_FIELDS,
  } from '@/components/Transfer/constants.js';

  export default {
    name: 'TransferPanel',
    components: {
      OffenderImage,
    },
    data: () => ({
      alertHasBeenViewed: false,
    }),
    computed: {
      ...sync('transfers', ['transferData', 'selTransferReason']),
      ...get('transfers', [
        'somsOffender',
        'showSOMSData',
        'showHousing',
        'showPhysical',
        'showMedical',
        'showPhoto',
        'showComments',
      ]),
      ...sync('schedules', ['selSchedule']),
      ...get('schedules', ['schedules']),
      ...get('reasons', ['reasons']),
      displayPhoto() {
        if (this.somsOffender && this.somsOffender.photograph) {
          return `data:image/jpg;base64,${this.somsOffender.photograph}`;
        } else {
          return `data:image/jpg;base64,${userplaceholder}`;
        }
      },
      SOMS_DATA_FIELDS() {
        return SOMS_DATA_FIELDS(this.somsOffender);
      },
      COMMENT_FIELDS() {
        return COMMENT_FIELDS(this.somsOffender);
      },
      CASE_FACTOR_FIELDS() {
        return CASE_FACTOR_FIELDS(this.somsOffender);
      },
      ENDORSEMENT_FIELDS() {
        return ENDORSEMENT_FIELDS(this.somsOffender);
      },
      /**
       * Filter out any schedules with a destination offender is not endorsed for
       */
      validSchedules() {
        let result = [];
        if (
          this.somsOffender &&
          this.somsOffender.endorsedInstitution &&
          this.schedules &&
          Array.isArray(this.schedules)
        ) {
          const institutionId = this.$store.getters[
            'institutions/getInstitutionByName'
          ](this.somsOffender.endorsedInstitution).institutionId;
          const id = this.transferData.scheduleId;
          result = this.schedules.filter(
            (sched) =>
              institutionId.includes(sched.destination) ||
              id === this.transferData.scheduleId
          );
        }

        return result;
      },
    },
    methods: {
      updateComments(ctrl) {
        if (ctrl) {
          if (ctrl.target.labels[0].innerText === 'In-House Remarks') {
            if (this.transferData.inHouseRemarks) {
              this.transferData.inHouseRemarks = ctrl.target._value;
            }
          } else {
            if (this.transferData.comments) {
              this.transferData.comments = ctrl.target._value;
            }
          }
        }
      },
      transferReasonSelected(ctrl) {
        if (ctrl) {
          this.transferData.transferReasonCode = ctrl.reasonCode;
          this.transferData.transferReasonDesc = ctrl.reasonDesc;
        }
      },
      scheduleSelected() {
        if (
          !this.alertHasBeenViewed &&
          this.somsOffender.TransferHolds &&
          this.somsOffender.TransferHolds.length > 0
        ) {
          alert(`This person has one or more holds!`);
          this.alertHasBeenViewed = true;
        }
      },
    },
  };
</script>
