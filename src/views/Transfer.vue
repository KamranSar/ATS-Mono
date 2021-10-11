<template>
  <div>
    <v-card class="mt-1 mb-6 pa-1">
      <v-card elevation="3" class="ma-1 pb-8">
        <v-card-title class="light-grey lighten-4">
          <v-row>
            <v-col cols="6">
              <span>Transfer</span>
            </v-col>
            <v-col cols="6">
              <v-row class="pt-4 mr-3" justify="end"
                ><v-icon small color="primary" right>mdi-arrow-left</v-icon>
                <a class="text-decoration-none subtitle-2">Back to Home</a>
              </v-row>
            </v-col>
          </v-row>
        </v-card-title>
        <v-progress-linear
          :active="loading"
          :indeterminate="loading"
          absolute
          color="primary"
        ></v-progress-linear>
        <v-divider></v-divider>
        <v-card-text class="pa-2 ma-0">
          <v-form v-model="formValid" ref="myForm">
            <v-row class="pa-0 ma-0" no-gutters justify="start">
              <v-col cols="4" class="ma-0 pa-0">
                <v-text-field
                  class="pt-1 pb-0 ma-0"
                  dense
                  outlined
                  clearable
                  autocomplete="off"
                  label="Enter CDCR Number"
                  type="text"
                  @keypress.enter="searchOffender"
                  @change="somsCDCRNumber = somsCDCRNumber.toUpperCase()"
                  @keyup="somsCDCRNumber = somsCDCRNumber.toUpperCase()"
                  v-model="somsCDCRNumber"
                  hide-details
                >
                </v-text-field>
              </v-col>
              <v-col cols="1">
                <v-btn
                  color="secondary"
                  class="pa-5 ml-2 mt-1"
                  @click="searchOffender"
                  :loading="loading"
                >
                  <v-icon>mdi-magnify</v-icon>
                  Search
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="my-0 pt-2" v-show="displayOffender">
              <v-col class="py-0 my-0" cols="4" sm="6" md="3" lg="3">
                <v-img
                  height="100%"
                  editForm
                  class="white--text"
                  :src="displayPhoto"
                  contain
                >
                  <!-- <v-img max-height="400px" contain :src="displayPhoto"> -->
                  <template v-slot:placeholder>
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </template>
                </v-img>
              </v-col>
              <v-col cols="4" sm="6" md="3" lg="3">
                <div>
                  <v-row no-gutters>
                    <v-col class="pb-1">
                      <p class="font-weight-black black--text title pa-0 ma-0">
                        {{
                          somsOffender.firstName + ' ' + somsOffender.lastName
                        }}
                      </p>
                      <span>
                        {{ somsOffender.institution }}
                      </span>
                      <br />
                      <v-btn
                        v-show="housingRestriction"
                        x-small
                        fab
                        color="brown darken-1"
                        class="ml-2 data"
                        @click="housingRestrictionsDialog = true"
                        dark
                      >
                        <v-icon>mdi-home</v-icon>
                      </v-btn>
                      <v-btn
                        v-show="physicalLimitation"
                        x-small
                        fab
                        color="blue-grey darken-1"
                        class="ml-2 data"
                        @click="physicalLimitationsDialog = true"
                        dark
                      >
                        <v-icon>mdi-run</v-icon>
                      </v-btn>
                      <v-btn
                        v-show="medicalEquipment"
                        x-small
                        fab
                        class="ml-2 data"
                        color="red lighten-1"
                        @click="medicalEquipmentDialog = true"
                        dark
                      >
                        <v-icon class="pb-1">mdi-medical-bag</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-divider class="pb-2"></v-divider>
                  <span class="labeling">CDCR Number:</span>
                  <span class="data">{{ somsOffender.cdcrNumber }}</span>
                  <br />
                  <span class="labeling">Offender ID:</span>
                  <span class="data">{{ somsOffender.offenderId }}</span>
                  <br />
                  <span class="labeling">Arrival Date:</span>
                  <span class="data">{{ somsOffender.arrivalDate }}</span>
                  <br />
                  <span class="labeling">Release Date:</span>
                  <span class="data">{{ somsOffender.releaseDate }}</span>
                  <br />
                  <span class="labeling">Release Type:</span>
                  <span class="data">{{ somsOffender.releaseType }}</span>
                  <br />
                  <span class="labeling">Override Reason: </span>
                  <span class="data">{{ somsOffender.overrideReason }}</span>
                  <br />
                  <span class="labeling">Override testing reason</span>
                  <span class="data">{{
                    somsOffender.overrideTestingReason
                  }}</span>
                  <br />
                  <span class="labeling">Mental Health:</span>
                  <span class="data">{{ somsOffender.Mental }}</span>
                  <!-- <span class="labeling">Job Assignment:</span>
                  <span class="data">{{ somsOffender.jobTitle }}</span>
                  <br />
                  <span class="labeling">MH Level of Care:</span>
                  <span class="data">{{ somsOffender.mhLoc }}</span> -->
                </div>
                <v-divider></v-divider>
                <div>
                  <span class="labeling">Housing:</span>
                  <span class="data">{{ displayHousing }}</span>
                  <br />
                  <span class="labeling">Ethnicity:</span>
                  <span class="data">{{ somsOffender.ethnicity }}</span>
                  <br />
                  <span class="labeling">TB Code:</span>
                  <span class="data">{{ somsOffender.tabeScore }}</span>
                  <br />
                  <span class="labeling">TABE Score:</span>
                  <span class="data">{{ somsOffender.tabeScore }}</span>
                  <br />
                  <!-- <span class="labeling">Comprehends English: </span>
                  <span class="data">
                    {{ somsOffender.comprehendsEnglish }}
                  </span>
                  <br />
                  <span class="labeling">Primary Language: </span>
                  <span class="data">{{ somsOffender.primaryLanguage }}</span> -->
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="py-0 my-0" cols="4" sm="6" md="3" lg="3">
                <div>
                  <span>Schedule Information</span>
                  <v-divider class="pb-2"></v-divider>
                  <v-text-field label="Date" dense></v-text-field>
                  <v-select label="Specific Transfer Reason" dense></v-select>
                  <br />
                  <v-select label="Schedule" dense></v-select>
                  <br />
                  <v-select label="Via 1" dense></v-select>
                  <br />
                  <v-select label="Via 2" dense></v-select>
                </div>
              </v-col>
              <v-col class="py-0 my-0" cols="4" sm="6" md="3" lg="3">
                <span>Endorsement Information</span>
                <v-divider class="pb-2"></v-divider>
                <v-text-field label="Date" dense></v-text-field>
                <v-select label="Endorsed To" dense></v-select>
                <br />
                <v-select label="Original Date" dense></v-select>
                <br />
                <v-select label="Current Date" dense></v-select>
                <br />
                <v-select label="Expiration Date" dense></v-select>
                <br />
                <v-select label="Security Level" dense></v-select>
                <br />
                <v-select label="Security Level Test" dense></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-card>

    <!-- <v-divider class="pb-2"></v-divider>
    <v-card>
      <v-row class="mt-2">
        <v-col cols="3">
          <v-text-field
            dense
            label="Hold Date"
            prepend-icon="mdi-calendar"
            v-bind="attrs"
            v-on="on"
            placeholder=""
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-combobox dense label="Hold Reason" placeholder=" "> </v-combobox>
        </v-col>
        <v-col cols="4">
          <v-text-field
            dense
            label="Hold Comments"
            placeholder=" "
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card> -->
    <!-- <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions> -->
    <!-- <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog> -->
    <!-- <v-card>
      <v-row class="px-3" no-gutters>
        <v-col class="py-0 my-0" cols="10" sm="6" md="4" lg="3">
          <v-combobox label="Destination" placeholder=" "></v-combobox>
          <br />
          <v-combobox label="Schedule" placeholder=" "></v-combobox>

          <br />
          <v-combobox dense label="VIA1" placeholder=" "></v-combobox>
          <br />
          <v-combobox dense label="VIA2" placeholder=" "></v-combobox>
          <br />
          <v-text-field
            label="Transfer Date"
            prepend-icon="mdi-calendar"
            v-bind="attrs"
            v-on="on"
            placeholder=" "
          ></v-text-field>
          <br />
          <v-text-field
            dense
            label="Specific Transfer Reason"
            placeholder=" "
          ></v-text-field>

          <br />
          <br />
        </v-col>
        <v-col cols="6">
          <v-combobox
            dense
            label="Offender Case Factors"
            placeholder=" "
          ></v-combobox>
        </v-col>
      </v-row>
    </v-card>

    <v-row>

      <v-col cols="8">
        <v-tabs vertical>
          <v-tab> Auditor Comments </v-tab>
          <v-tab> CDCR 135 Comments </v-tab>
          <v-tab> In-House Remarks </v-tab>

          <v-tab-item>
            <v-card>
              <v-card-text>
                <v-textarea
                  label="Auditor Comments"
                  readonly
                  placeholder=" "
                  rows="4"
                ></v-textarea>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card>
              <v-card-text>
                <v-textarea
                  label="CDCR 135 Comments"
                  placeholder=" "
                  rows="4"
                ></v-textarea>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card>
              <v-card-text>
                <v-textarea
                  label="In-House Remarks"
                  placeholder=" "
                  rows="4"
                ></v-textarea>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row> -->
  </div>
</template>

<script>
  //  import { get } from 'vuex-pathify';
  // import transferservice from '@/feathers/services/transfer/transfer.service.js';
  import somsOffender from '@/feathers/services/offender/details.service.js';
  import { userplaceholder } from '@/assets/userplaceholder.js';
  import formatDate from '@/helpers/formatDate';

  export default {
    name: 'NewRequest',

    data: () => ({
      //Imported Methods
      formatDate,
      formValid: false,
      displayOffender: true,
      loading: false,
      somsCDCRNumber: '',
      somsOffender: {
        offenderId: '0123456789',
        cdcrNumber: 'AR1234',
        lastName: 'Last',
        firstName: 'First',
        middleName: 'Duh',
        suffix: '',
        dob: null,
        gender: 'Male',
        ethnicity: 'Caucasion',
        location: 'here',
        housingArea: 'there',
        bed: 'cot',
        arrivalDate: null,
        tabeScore: '1',
        releaseDate: formatDate('01/01/2049', false),
        releaseType: 'X',
        mhLoc: '',
        formType: '',
        auditType: 'A',
        auditTypeDescription: 'Audit Type A',
        institution: 'California Health Care Facility - Stockton',
        securityLevel: '2',
        program: '',
        overrideReason: '',
        endorseDate: new Date('01/01/2049'), // Needs to be labeled as Current Endorsement Date
        expirationDate: new Date('01/30/2049'),
        comments: '', // Needs to be labeled as Auditor Comments
        HousingRestrictions: [
          {
            effectiveDate: null,
            expirationDate: null,
            housingRestriction: 'Restricted',
            housingRestrictionDescription: 'Desc',
            housingRestrictionDurationType: 'Long time',
          },
        ],
        TransferHolds: [
          {
            effectiveDate: null,
            expirationDate: null,
            holdType: '',
            holdTypeDescription: '',
            comments: '',
          },
        ],
        PhysicalLimitations: [
          {
            effectiveDate: null,
            expirationDate: null,
            physicalLimitation: '',
            physicalLimitationDescription: '',
            physicalLimitationType: '',
          },
        ],
        RulesViolations: [
          {
            violationDate: null,
            reportNumber: '',
            violationCode: '',
            rvrLevel: '',
            rvrLevelDescription: '',
            rvrStatus: '',
            rvrStatusDescription: '',
          },
        ],
        // ATS Fields
        originalEndorsementDate: null,
        transferDate: null,
        isTransfered: false,
        schedule: '',
        isScheduled: false,
        transferReason: '',
        vias: [],
        cdcr135Comments: '',
        inHouseRemarks: '',
      },
      housingRestriction: true,
      physicalLimitation: true,
      medicalEquipment: true,
    }),
    computed: {
      // ...get('users', ['loggedInUser']),
      displayPhoto() {
        if (this.somsOffender && this.somsOffender.photograph) {
          return `data:image/jpg;base64,${this.somsOffender.photograph}`;
        } else {
          return `data:image/jpg;base64,${userplaceholder}`;
        }
      },
    },
    methods: {
      async searchOffender() {
        // this.continue1824();
        this.loading = true;
        try {
          // const offenderInfo = await somsOffender.getOffender(
          //   this.somsCDCRNumber
          // );
          const query = {
            query: {
              cdcrnumber: this.cdcrNumber,
            },
          };

          const offenderInfo = somsOffender.find(query);

          if (offenderInfo.data.length > 0) {
            this.somsOffender = offenderInfo.data[0];
            //     if (
            //       this.somsOffender &&
            //       this.somsOffender.institutionName &&
            //       this.loggedInUser &&
            //       this.loggedInUser.somsinfo &&
            //       this.loggedInUser.somsinfo.organizationName &&
            //       this.somsOffender.institutionName !==
            //         this.loggedInUser.somsinfo.organizationName
            //     ) {
            //       throw Error('You do not belong to this institution');
            //     }
            //     this.displayHousing =
            //       this.somsOffender.housingArea + ' ' + this.somsOffender.bed;
            //     this.checkAlerts();
            //     await this.getPrevious1824Requests();
            //     await this.getPrevious1824Issues();
            setTimeout(() => {
              this.loading = false;
              this.displayOffender = true;
            }, 500);

            return offenderInfo;
          } else {
            this.loading = false;
            this.searchOffenderNotFoundErrorDialog = true;
          }
        } catch (error) {
          this.loading = false;
          if (error.code == 500) {
            this.searchOffenderNotFoundErrorDialog = true;
          } else if (error.message == 'You do not belong to this institution') {
            this.offenderSearchPermissionDialog = true;
          } else {
            // Display a message that an error occurred!!!
          }
        }
      },
    },
  };
</script>
<style scoped>
  .labeling {
    font-weight: bold;
    padding-right: 4px;
  }
  .data {
    float: right;
  }
</style>
