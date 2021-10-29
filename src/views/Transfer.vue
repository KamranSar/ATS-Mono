<template>
  <div>
    <v-card elevation="3" class="ma-4 px-4 pb-4">
      <v-card-title class="light-grey lighten-4">
        <v-row>
          <v-col cols="3">
            <span>Transfer</span>
          </v-col>
          <v-col cols="4">
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
          <v-col cols="2">
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
          <v-col cols="3">
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
          <v-row class="my-0 pt-2">
            <v-col>
              <div>
                <v-row no-gutters>
                  <v-col cols="1">
                    <span style="width: 50px">
                      <div class="photo-sm">
                        <v-img
                          editForm
                          class="white--text"
                          :src="displayPhoto"
                          @click="showInfo('photo')"
                        >
                          <template v-slot:placeholder>
                            <v-progress-circular
                              indeterminate
                              color="grey lighten-5"
                            ></v-progress-circular>
                          </template>
                        </v-img>
                      </div>
                    </span>
                  </v-col>
                  <v-col cols="3" class="pb-1">
                    <span class="font-weight-black black--text title pa-0 ma-0">
                      {{ somsOffender.firstName + ' ' + somsOffender.lastName }}
                    </span>
                    <br />
                    <span>
                      {{ somsOffender.institutionName }}
                    </span>
                  </v-col>
                  <v-col cols="3" class="pb-1" align-self="center">
                    <!-- <div style="text-align: right"> -->
                    <div>
                      <span>
                        <v-btn
                          v-show="btnInfo"
                          x-small
                          fab
                          color="gray darken-1"
                          class="ml-2"
                          @click="showInfo('info')"
                          dark
                        >
                          <v-icon>mdi-account</v-icon>
                        </v-btn>
                        <v-btn
                          v-show="btnHousing"
                          x-small
                          fab
                          color="brown darken-1"
                          class="ml-2"
                          @click="showInfo('housing')"
                          dark
                        >
                          <v-icon>mdi-home</v-icon>
                        </v-btn>
                        <v-btn
                          v-show="btnPhysical"
                          x-small
                          fab
                          color="blue-grey darken-1"
                          class="ml-2"
                          @click="showInfo('physical')"
                          dark
                        >
                          <v-icon>mdi-run</v-icon>
                        </v-btn>
                        <v-btn
                          v-show="btnMedical"
                          x-small
                          fab
                          class="ml-2"
                          color="red lighten-1"
                          @click="showInfo('medical')"
                          dark
                        >
                          <v-icon class="pb-1">mdi-medical-bag</v-icon>
                        </v-btn>
                        <v-btn
                          x-small
                          fab
                          color="gray darken-1"
                          class="ml-2"
                          @click="showInfo('comments')"
                          dark
                        >
                          <v-icon>mdi-comment-text-outline</v-icon>
                        </v-btn>
                      </span>
                    </div>
                  </v-col>
                  <v-col cols="5" class="pb-1" align="right">
                    <v-dialog v-model="dlgSaveForm" persistent max-width="480">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="secondary"
                          v-bind="attrs"
                          v-on="on"
                          @click="dlgSave = true"
                          dense
                        >
                          <v-icon>mdi-content-save-outline</v-icon>
                          Save
                        </v-btn>
                      </template>
                      <template v-slot:default="dlgSaveForm">
                        <v-card>
                          <v-toolbar color="primary" dark>
                            Confirm Transfer
                          </v-toolbar>
                          <v-card-text>
                            <div class="text-h2 pa-12">
                              Confirm transfer by clicking Yes or No.
                            </div>
                          </v-card-text>
                          <v-card-actions class="justify-end">
                            <v-btn
                              color="primary"
                              text
                              @click="dlgSaveForm = false"
                            >
                              No
                            </v-btn>
                            <v-btn color="primary" text @click="saveForm">
                              Yes
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>
                  </v-col>
                </v-row>
              </div>
              <v-divider class="pb-2"></v-divider>
            </v-col>
          </v-row>
          <v-row class="my-0">
            <v-col cols="3" sm="6" md="3" lg="3">
              <div v-show="showSOMSData">
                <span>Persons Information</span>
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
                <span class="labeling">Ethnicity:</span>
                <span class="data">{{ somsOffender.ethnicity }}</span>
                <br />
                <span class="labeling">TB Code:</span>
                <span class="data">{{ somsOffender.tabeScore }}</span>
                <br />
                <!-- <span class="labeling">Release Date:</span>
                  <span class="data">{{ somsOffender.releaseDate }}</span>
                  <br />
                  <span class="labeling">Release Type:</span>
                  <span class="data">{{ somsOffender.releaseType }}</span>
                  <br /> -->
                <!-- <br /> -->
                <span class="labeling">Mental Health:</span>
                <span class="data">{{ somsOffender.Mental }}</span>
                <br />
                <!-- <span class="labeling">Job Assignment:</span>
                  <span class="data">{{ somsOffender.jobTitle }}</span>
                  <br />
                  <span class="labeling">MH Level of Care:</span>
                  <span class="data">{{ somsOffender.mhLoc }}</span> -->
                <!-- </div> -->
                <span class="labeling">Override Reason: </span>
                <span class="data">{{ somsOffender.overrideReason }}</span>
                <v-divider></v-divider>
                <!-- <br />
                <span class="labeling">Override testing reason</span>
                <span class="data">
                  {{ somsOffender.overrideTestingReason }}
                </span> -->
                <!-- <div> -->
                <!-- <span class="labeling">Housing:</span>
                  <span class="data">{{ somsOffender.housingArea }}</span>
                  <br /> -->
                <!-- <span class="labeling">TABE Score:</span>
                  <span class="data">{{ somsOffender.tabeScore }}</span>
                  <br /> -->
                <!-- <span class="labeling">Comprehends English: </span>
                  <span class="data">
                    {{ somsOffender.comprehendsEnglish }}
                  </span>
                  <br />
                  <span class="labeling">Primary Language: </span>
                  <span class="data">{{ somsOffender.primaryLanguage }}</span> -->
              </div>
              <div v-show="showPhoto">
                <v-img editForm class="white--text" :src="displayPhoto">
                  <template v-slot:placeholder>
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </template>
                </v-img>
              </div>
              <div v-show="showHousing">
                <span>Housing Restrictions</span>
                <v-divider class="pb-2"></v-divider>
                <ul>
                  <li
                    v-for="item in this.somsOffender.HousingRestrictions"
                    :key="item.housingRestriction"
                  >
                    {{ item.housingRestrictionDescription }}
                  </li>
                </ul>
              </div>
              <div v-show="showPhysical">
                <span>Physical Limitations</span>
                <v-divider class="pb-2"></v-divider>
                <ul>
                  <li
                    v-for="item in this.somsOffender.PhysicalLimitations"
                    :key="item.physicalLimitation"
                  >
                    {{ item.physicalLimitationDescription }}
                  </li>
                </ul>
              </div>
              <div v-show="showMedical">
                <span>Durable Medical Equipment</span>
                <v-divider class="pb-2"></v-divider>
                <ul>
                  <li
                    v-for="item in this.somsOffender.MedicalEquipment"
                    :key="item.medicalEquipment"
                  >
                    {{ item.medicalEquipmentDescription }}
                  </li>
                </ul>
              </div>
              <div v-show="showComments">
                <span>Comments</span>
                <v-divider class="pb-2"></v-divider>
                <v-textarea
                  label="CDC 135/Status Report Comments"
                  outlined
                  no-resize
                  rows="3"
                  dense
                ></v-textarea>
                <v-textarea
                  label="In-House Remarks"
                  outlined
                  no-resize
                  rows="3"
                  dense
                ></v-textarea>
              </div>
            </v-col>
            <v-col cols="3" sm="6" md="3" lg="3">
              <!-- <v-row dense>
                  <v-col>
                    <span>Release Information</span>
                    <v-divider class="pb-2"></v-divider>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col>
                    <v-text-field label="Release Date" dense></v-text-field>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col>
                    <v-text-field label="Release Type" dense></v-text-field>
                  </v-col>
                </v-row> -->
              <span>Release Information</span>
              <v-divider class="pb-2"></v-divider>
              <v-text-field label="Release Date" dense></v-text-field>
              <!-- <br /> -->
              <v-text-field label="Release Type" dense></v-text-field>
            </v-col>
            <v-col cols="3" sm="6" md="3" lg="3">
              <span>Housing Information</span>
              <v-divider class="pb-2"></v-divider>
              <v-text-field label="Current Housing" dense></v-text-field>
              <v-text-field label="Temporary Housing" dense></v-text-field>
              <v-select label="Security Level" dense></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <div>
                <v-data-table
                  :items-per-page="itemsPerPage"
                  dense
                  :headers="caseFactorsHeader"
                  :items="caseFactors"
                  item-key="code"
                  class="elevation-1"
                  :search="cfCode"
                  @keypress="filterCaseFactors"
                  no-data-text="No Case Factors"
                  no-results-text="No Case Factors Found"
                >
                  <template
                    v-slot:top
                    class="pb-4"
                    style="boder: 1px solid lightgray"
                  >
                    <span style="color: rgba(0, 0, 0, 0.6); font-size: 14px">
                      Case Factors
                    </span>
                    <v-dialog v-model="dlgEditCF" max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <button
                          type="button"
                          style="
                            background-color: #1976d2;
                            border-radius: 4px;
                            float: right;
                            margin-top: -2px;
                          "
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon dark dense>mdi-plus</v-icon>
                        </button>
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="text-h5">{{ formTitleCF }}</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col>
                                <v-text-field
                                  v-model="editedCaseFactorItem.code"
                                  label="Code"
                                >
                                </v-text-field>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="blue darken-2"
                            text
                            @click="cancelCaseFactor"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            color="blue darken-2"
                            text
                            @click="saveCaseFactor"
                          >
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-dialog v-model="dlgDeleteCF" max-width="500px">
                      <v-card>
                        <v-card-title class="text-h5">
                          Are you sure you want to delete this item?
                        </v-card-title>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="cancelDeleteCaseFactor"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="confirmDeleteCaseFactor"
                          >
                            OK
                          </v-btn>
                          <v-spacer></v-spacer>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-divider class="pb-4"></v-divider>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-icon
                      small
                      class="mr-2"
                      @click="editCaseFactorItem(item)"
                    >
                      mdi-pencil
                    </v-icon>
                    <v-icon small @click="deleteCaseFactorItem(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                  <template v-slot:no-data>
                    <v-btn color="primary"> Reset </v-btn>
                  </template>
                </v-data-table>
              </div>
            </v-col>
            <v-col cols="8">
              <div>
                <v-data-table
                  :items-per-page="itemsPerPage"
                  dense
                  :headers="holdsHeader"
                  :items="holds"
                  item-key="number"
                  class="elevation-1"
                  :search="holdNum"
                  @keypress="filterHolds"
                  no-data-text="No Holds"
                  no-results-text="No Holds Found"
                >
                  <template
                    v-slot:top
                    class="pb-4"
                    style="boder: 1px solid lightgray"
                  >
                    <span style="color: rgba(0, 0, 0, 0.6); font-size: 14px">
                      Holds
                    </span>
                    <v-dialog v-model="dlgEditHold" max-width="400px">
                      <template v-slot:activator="{ on, attrs }">
                        <button
                          type="button"
                          style="
                            background-color: #1976d2;
                            border-radius: 4px;
                            float: right;
                            margin-top: -2px;
                          "
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon dark dense>mdi-plus</v-icon>
                        </button>
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="text-h5">{{ formTitleHold }}</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col>
                                <v-text-field
                                  v-model="editedHoldItem.number"
                                  label="Number"
                                >
                                </v-text-field>
                              </v-col>
                              <v-col>
                                <v-text-field
                                  v-model="editedHoldItem.reason"
                                  label="Reason"
                                >
                                </v-text-field>
                              </v-col>
                              <v-col>
                                <v-text-field
                                  v-model="editedHoldItem.date"
                                  label="Date"
                                >
                                </v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col>
                                <v-text-field
                                  v-model="editedHoldItem.comments"
                                  label="Comments"
                                >
                                </v-text-field>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-2" text @click="cancelHold">
                            Cancel
                          </v-btn>
                          <v-btn color="blue darken-2" text @click="saveHold">
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-dialog v-model="dlgDeleteHold" max-width="500px">
                      <v-card>
                        <v-card-title class="text-h5">
                          Are you sure you want to delete this item?
                        </v-card-title>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="cancelDeleteHold"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="confirmDeleteHold"
                          >
                            OK
                          </v-btn>
                          <v-spacer></v-spacer>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-divider class="pb-4"></v-divider>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-icon small class="mr-2" @click="editHoldItem(item)">
                      mdi-pencil
                    </v-icon>
                    <v-icon small @click="deleteHoldItem(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                  <template v-slot:no-data>
                    <v-btn color="primary"> Reset </v-btn>
                  </template>
                </v-data-table>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span>Endorsement Information</span>
              <v-divider></v-divider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-select
                label="Endorsed To"
                v-model="selEndorsedTo"
                :items="listOfInstitutions"
                item-text="institutionName"
                item-value="institutionName"
                prepend-icon="mdi-bank"
                class="pl-1"
                clearable
                single-line
                hide-details="true"
                dense
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-text-field label="Original Date" dense></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field label="Current Date" dense></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field label="Expiration Date" dense></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-row>
                <v-col>
                  <span>Schedule Information</span>
                  <v-divider class="pb-2"></v-divider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-select label="Schedule" dense></v-select>
                </v-col>
                <v-col cols="3">
                  <v-select label="Specific Transfer Reason" dense></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="2">
                  <v-text-field
                    v-model="schedule.via1"
                    label="Via 1"
                    dense
                    filled
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    v-model="schedule.via2"
                    label="Via 2"
                    dense
                    readonly
                    filled
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    v-model="schedule.transferDate"
                    label="Transfer Date"
                    dense
                    readonly
                    filled
                  ></v-text-field>
                </v-col>
                <v-col cols="6" align="right" align-self="center">
                  <v-btn
                    color="secondary"
                    class="ma-5"
                    @click="dlgSave = true"
                    dense
                  >
                    <v-icon>mdi-content-save-outline</v-icon>
                    Save
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import somsOffender from '@/feathers/services/offender/details.service.js';
  import transfer from '@/feathers/services/transfer/transfer.service.js';
  import { userplaceholder } from '@/assets/userplaceholder.js';
  import formatDate from '@/helpers/formatDate';
  import findAll from '@/feathers/helpers/findAll.js';

  export default {
    name: 'NewRequest',

    data: () => ({
      //Imported Methods
      formatDate,
      dlgCancelForm: false,
      dlgSaveForm: false,
      loading: false,
      formValid: false,
      displayOffender: true,
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
        arrivalDate: formatDate('01/01/2011', false),
        tabeScore: '1',
        releaseDate: formatDate('01/01/2049', false),
        releaseType: 'X',
        mhLoc: '',
        formType: '',
        auditType: 'A',
        auditTypeDescription: 'Audit Type A',
        institutionName: 'California Health Care Facility - Stockton',
        securityLevel: '2',
        program: '',
        overrideReason: '',
        endorseDate: formatDate('01/01/2049', false), // Needs to be labeled as Current Endorsement Date
        expirationDate: formatDate('01/30/2049', false),
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
        dateEndorsementOriginal: null,
        dateEndorsementCurrent: null,
        dateEndorsementExpiration: null,
        transferDate: null,
        isTransfered: false,
        schedule: '',
        isScheduled: false,
        transferReason: '',
        vias: [],
        cdcr135Comments: '',
        inHouseRemarks: '',
      },
      selEndorsedTo: '',
      listOfInstitutions: [],
      btnInfo: true,
      showSOMSData: true,
      btnHousing: true,
      showHousing: false,
      btnPhysical: true,
      showPhysical: false,
      btnMedical: true,
      showMedical: false,
      showPhoto: false,
      showComments: false,
      // Case Factors Table Header
      itemsPerPage: 5,
      caseFactorsHeader: [
        {
          text: 'Code',
          value: 'code',
        },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      cfCode: '',
      dlgDeleteCF: false,
      dlgEditCF: false,
      editCFTitle: '',
      editedCaseFactorIndex: -1,
      editedCaseFactorItem: {
        code: 0,
      },
      defaultCFItem: {
        code: 0,
      },
      caseFactors: [
        {
          code: 1,
        },
        {
          code: 2,
        },
        {
          code: 3,
        },
      ],
      // Holds Table Header
      holdsHeader: [
        { text: 'Number', value: 'number' },
        { text: 'Reason', value: 'reason' },
        { text: 'Date', value: 'date' },
        { text: 'Comments', value: 'comments' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      holdNum: '',
      dlgDeleteHold: false,
      dlgEditHold: false,
      editHoldTitle: '',
      editedHoldIndex: -1,
      editedHoldItem: {
        number: 0,
        reason: '',
        date: '',
        comments: '',
      },
      defaultHoldItem: {
        number: 0,
        reason: '',
        date: '',
        comments: '',
      },
      holds: [
        {
          number: 1,
          reason: 'Not liked',
          date: '01/01/2049',
          comments: 'Sorry Charlie',
        },
        {
          number: 2,
          reason: 'Not liked',
          date: '01/02/2049',
          comments: 'Sorry Charlie',
        },
        {
          number: 3,
          reason: 'Not liked',
          date: '01/03/2049',
          comments: 'Sorry Charlie',
        },
      ],
    }),
    watch: {
      dlgEditCF(val) {
        val || this.cancelCaseFactor();
      },
      dlgDeleteCF(val) {
        val || this.cancelDeleteCaseFactor();
      },
    },
    computed: {
      displayPhoto() {
        if (this.somsOffender && this.somsOffender.photograph) {
          return `data:image/jpg;base64,${this.somsOffender.photograph}`;
        } else {
          return `data:image/jpg;base64,${userplaceholder}`;
        }
      },
      formTitleCF() {
        return this.editedCaseFactorIndex === -1
          ? 'New Case Factor'
          : 'Edit Case Factor';
      },
      formTitleHold() {
        return this.editedHoldIndex === -1 ? 'New Hold' : 'Edit Hold';
      },
    },
    async mounted() {
      await this.getInstitutions();
    },
    methods: {
      async searchOffender() {
        this.loading = true;
        try {
          const query = {
            query: {
              cdcrnumber: this.somsCDCRNumber,
            },
          };

          const offenderInfo = await somsOffender.find(query);

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
      showInfo(choice) {
        this.showSOMSData = choice == 'info' ? true : false;
        this.showPhoto = choice == 'photo' ? true : false;
        this.showHousing = choice == 'housing' ? true : false;
        this.showPhysical = choice == 'physical' ? true : false;
        this.showMedical = choice == 'medical' ? true : false;
        this.showComments = choice == 'comments' ? true : false;
      },
      async getInstitutions() {
        try {
          this.loading = true;
          const query = {
            query: {
              $sort: {
                institutionName: 1,
              },
            },
          };

          const institutions = await findAll(
            '/api/eis/common/v1/institution',
            query
          );

          this.listOfInstitutions = institutions.data;
          return this.listOfInstitutions;
        } catch (error) {
          console.error('getInstitutions: ', error);
          this.listOfInstitutions = [];
          return [];
        } finally {
          this.loading = false;
        }
      },
      // Case Factor Methods
      filterCaseFactors() {},
      editCaseFactorItem(item) {
        this.editedCaseFactorIndex = this.caseFactors.indexOf(item);
        this.editedCaseFactorItem = Object.assign({}, item);
        this.dlgEditCF = true;
      },
      cancelCaseFactor() {
        this.dlgEditCF = false;
        this.$nextTick(() => {
          this.editedCaseFactorItem = Object.assign({}, this.defaultItem);
          this.editedCaseFactorIndex = -1;
        });
      },
      saveCaseFactor() {
        if (this.editedCaseFactorIndex > -1) {
          Object.assign(
            this.caseFactors[this.editedCaseFactorIndex],
            this.editedCaseFactorItem
          );
        } else {
          this.caseFactors.push(this.editedCaseFactorItem);
        }
        this.cancelCaseFactor();
      },
      deleteCaseFactorItem(item) {
        debugger;
        this.editedCaseFactorIndex = this.caseFactors.indexOf(item);
        this.editedCaseFactorItem = Object.assign({}, item);
        this.dlgDeleteCF = true;
      },
      cancelDeleteCaseFactor() {
        this.dlgDeleteCF = false;
        this.$nextTick(() => {
          this.editedCaseFactorItem = Object.assign({}, this.defaultItem);
          this.editedCaseFactorIndex = -1;
        });
      },
      confirmDeleteCaseFactor() {
        this.caseFactors.splice(this.editedCaseFactorIndex, 1);
        this.cancelDeleteCaseFactor();
      },
      // Hold Methods
      filterHolds() {},
      editHoldItem(item) {
        this.editedHoldIndex = this.holds.indexOf(item);
        this.editedHoldItem = Object.assign({}, item);
        this.dlgEditHold = true;
      },
      cancelHold() {
        this.dlgEditHold = false;
        this.$nextTick(() => {
          this.editedHoldItem = Object.assign({}, this.defaultHoldItem);
          this.editedHoldIndex = -1;
        });
      },
      saveHold() {
        if (this.editedHoldIndex > -1) {
          Object.assign(this.holds[this.editedHoldIndex], this.editedHoldItem);
        } else {
          this.holds.push(this.editedHoldItem);
        }
        this.cancelHold();
      },
      deleteHoldItem(item) {
        this.editedHoldIndex = this.caseFactors.indexOf(item);
        this.editedHoldItem = Object.assign({}, item);
        this.dlgDeleteHold = true;
      },
      cancelDeleteHold() {
        this.dlgDeleteHold = false;
        this.$nextTick(() => {
          this.editedHoldItem = Object.assign({}, this.defaultHoldItem);
          this.editedHoldIndex = -1;
        });
      },
      confirmDeleteHold() {
        this.holds.splice(this.editedHoldIndex, 1);
        this.cancelDeleteCaseFactor();
      },
      cancelForm() {
        this.dlgCancelForm = false;
      },
      async saveForm() {
        // validate data
        // call api to send data to db
        // interrogate response - success or failure
        this.dlgSaveForm = false;

        const response = await transfer.Create(data);
        // response._id;
        // response.cdcrNumber;

        alert('saveForm(): completed successfully!');
        this.displayOffender = false;
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
  .divOutline {
    outline: 1px solid darkgray;
  }
  .photo-sm {
    height: 50px;
    width: 50px;
  }
</style>
