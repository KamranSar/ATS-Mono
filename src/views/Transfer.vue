<template>
  <div>
    <v-card elevation="3" class="ma-4 px-4 pb-4">
      <v-card-title>
        <v-row>
          <v-col cols="3">
            <h2>Transfer</h2>
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
              background-color="white"
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
        <v-form v-if="displayOffender" v-model="formValid" ref="myForm">
          <v-row class="my-0 pt-2">
            <v-col cols="10">
              <v-row no-gutters>
                <v-col cols="1">
                  <div class="photo-sm">
                    <offender-image
                      :somsOffender="somsOffender"
                      @click="showInfo('photo')"
                    ></offender-image>
                  </div>
                </v-col>
                <v-col cols="4" class="pb-1">
                  <div>
                    <span class="font-weight-black black--text title pa-0 ma-0">
                      <!-- {{ somsOffender.firstName + ' ' + somsOffender.lastName }} -->
                      {{ transferData.firstName + ' ' + transferData.lastName }}
                    </span>
                    <br />
                    <span>
                      {{ somsOffender.institutionName }}
                    </span>
                  </div>
                </v-col>
                <v-col cols="7" class="pb-1" align-self="center">
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
              </v-row>
              <v-divider class="pb-2"></v-divider>
            </v-col>
            <v-col cols="2" class="pb-1" align="right">
              <v-dialog v-model="dlgSaveForm" persistent max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="secondary"
                    v-bind="attrs"
                    v-on="on"
                    @click="dlgSaveForm = true"
                    dense
                  >
                    <v-icon>mdi-content-save-outline</v-icon>
                    Save
                  </v-btn>
                </template>
                <template>
                  <v-card>
                    <v-toolbar color="primary" dark>
                      Confirm Transfer
                    </v-toolbar>
                    <v-card-text>
                      <div class="text-h6 pa-12">
                        Confirm transfer by clicking Yes or No.
                      </div>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn color="primary" text @click="dlgSaveForm = false">
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
          <v-row class="my-0">
            <v-col cols="3" sm="6" md="3" lg="3">
              <div v-show="showSOMSData">
                <span>Persons Information</span>
                <v-divider class="pb-2"></v-divider>
                <span class="labeling">CDCR Number:</span>
                <span class="data">{{ transferData.cdcrNumber }}</span>
                <br />
                <span class="labeling">Offender ID:</span>
                <span class="data">{{ transferData.offenderId }}</span>
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
                <v-divider class="pb-2"></v-divider>
                <span class="labeling">Housing:</span>
                <span class="data">{{ somsOffender.housingArea }}</span>
                <br />
                <span class="labeling">Security Level:</span>
                <span class="data">{{ somsOffender.securityLevel }}</span>
                <br />
                <v-divider class="pb-2"></v-divider>
                <span class="labeling">Ethnicity:</span>
                <span class="data">{{ somsOffender.ethnicity }}</span>
                <br />
                <span class="labeling">TB Code:</span>
                <span class="data">{{ somsOffender.tabeScore }}</span>
                <br />
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
              <div v-show="showPhoto" class="photo-lg">
                <v-img class="white--text" :src="displayPhoto">
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
                  v-model="transferData.cdcr135Comments"
                  outlined
                  no-resize
                  rows="3"
                  dense
                ></v-textarea>
                <v-textarea
                  label="In-House Remarks"
                  v-model="transferData.inHouseRemarks"
                  outlined
                  no-resize
                  rows="3"
                  dense
                ></v-textarea>
              </div>
            </v-col>
            <!-- <v-col cols="3" sm="6" md="3" lg="3">
              <span>Release Information</span>
              <v-divider class="pb-2 mb-2"></v-divider>
              <v-text-field
                v-model="somsOffender.releaseDate"
                label="Release Date"
                dense
              ></v-text-field>
              <v-text-field
                v-model="somsOffender.releaseType"
                label="Release Type"
                dense
              ></v-text-field>
              <br />
              <span>Housing Information</span>
              <v-divider class="pb-2 mb-2"></v-divider>
              <v-text-field
                v-model="somsOffender.facilityName"
                label="Current Housing"
                dense
              ></v-text-field>
              <v-text-field
                v-model="somsOffender.securityLevel"
                label="Security Level"
                dense
              ></v-text-field>
            </v-col> -->
            <v-col cols="3" sm="6" md="3" lg="3">
              <div
                v-if="
                  somsOffender &&
                  somsOffender.CaseFactors &&
                  somsOffender.CaseFactors.length
                "
              >
                <span>Case Factors</span>
                <v-divider class="pb-2"></v-divider>
                <!-- <span class="labeling">
                  {{ 'LWOP: ' + somsOffender.CaseFactors[0].lifer_lwop_value }}
                </span>
                <span class="data">
                  {{ somsOffender.CaseFactors[0].lifer_lwop_flag }}
                </span>
                <br /> -->
                <table width="100%">
                  <tr>
                    <td class="labeling">SNY:</td>
                    <td>
                      {{ somsOffender.CaseFactors[0].sny_value }}
                    </td>
                    <td class="data">
                      {{ somsOffender.CaseFactors[0].sny_flag ? 'Y' : 'N' }}
                    </td>
                  </tr>
                  <tr>
                    <td class="labeling">CCMS EOP:</td>
                    <td>
                      {{ somsOffender.CaseFactors[0].cccms_eop_value }}
                    </td>
                    <td class="data">
                      {{
                        somsOffender.CaseFactors[0].cccms_eop_flag ? 'Y' : 'N'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="labeling">Cocci1:</td>
                    <td>
                      {{ somsOffender.CaseFactors[0].cocci1_value }}
                    </td>
                    <td class="data">
                      {{ somsOffender.CaseFactors[0].cocci1_flag ? 'Y' : 'N' }}
                    </td>
                  </tr>
                  <tr>
                    <td class="labeling">Cocci2:</td>
                    <td>
                      {{ somsOffender.CaseFactors[0].cocci2_value }}
                    </td>
                    <td class="data">
                      {{ somsOffender.CaseFactors[0].cocci2_flag ? 'Y' : 'N' }}
                    </td>
                  </tr>
                  <tr>
                    <td class="labeling">DPP:</td>
                    <td>
                      {{ somsOffender.CaseFactors[0].dpp_value }}
                    </td>
                    <td class="data">
                      {{ somsOffender.CaseFactors[0].dpp_flag ? 'Y' : 'N' }}
                    </td>
                  </tr>
                  <tr>
                    <td class="labeling">DDP:</td>
                    <td>
                      {{ somsOffender.CaseFactors[0].ddp_value }}
                    </td>
                    <td class="data">
                      {{ somsOffender.CaseFactors[0].ddp_flag ? 'Y' : 'N' }}
                    </td>
                  </tr>
                  <tr>
                    <td class="labeling">ICE:</td>
                    <td>
                      {{ somsOffender.CaseFactors[0].ice_value }}
                    </td>
                    <td class="data">
                      {{ somsOffender.CaseFactors[0].ice_flag ? 'Y' : 'N' }}
                    </td>
                  </tr>
                  <tr>
                    <td class="labeling">Retain ASU:</td>
                    <td>
                      {{ somsOffender.CaseFactors[0].retainASU_value }}
                    </td>
                    <td class="data">
                      {{
                        somsOffender.CaseFactors[0].retainASU_flag ? 'Y' : 'N'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="labeling">Transfer MERD:</td>
                    <td>
                      {{ somsOffender.CaseFactors[0].transferMERD_value }}
                    </td>
                    <td class="data">
                      {{
                        somsOffender.CaseFactors[0].transferMERD_flag
                          ? 'Y'
                          : 'N'
                      }}
                    </td>
                  </tr>
                </table>
                <!-- <span class="labeling">
                  {{ 'SNY: ' }}
                </span>
                <span class="">
                  {{ somsOffender.CaseFactors[0].sny_value }}
                </span>
                <span class="data">
                  {{ somsOffender.CaseFactors[0].sny_flag ? 'Y' : 'N' }}
                </span>
                <br /> -->
                <!-- <span class="labeling">
                  {{
                    'CCMS EOP: ' + somsOffender.CaseFactors[0].cccms_eop_value
                  }}
                </span>
                <span class="data">
                  {{ somsOffender.CaseFactors[0].cccms_eop_flag ? 'Y' : 'N' }}
                </span>
                <br />
                <span class="labeling">
                  {{ 'Cocci1: ' + somsOffender.CaseFactors[0].cocci1_value }}
                </span>
                <span class="data">
                  {{ somsOffender.CaseFactors[0].cocci1_flag ? 'Y' : 'N' }}
                </span>
                <br />
                <span class="labeling">
                  {{ 'Cocci2: ' + somsOffender.CaseFactors[0].cocci2_value }}
                </span>
                <span class="data">
                  {{ somsOffender.CaseFactors[0].cocci2_flag ? 'Y' : 'N' }}
                </span>
                <br />
                <span class="labeling">
                  {{ 'DPP: ' + somsOffender.CaseFactors[0].dpp_value }}
                </span>
                <span class="data">
                  {{ somsOffender.CaseFactors[0].dpp_flag ? 'Y' : 'N' }}
                </span>
                <br />
                <span class="labeling">
                  {{ 'DDP: ' + somsOffender.CaseFactors[0].ddp_value }}
                </span>
                <span class="data">
                  {{ somsOffender.CaseFactors[0].ddp_flag ? 'Y' : 'N' }}
                </span>
                <br />
                <span class="labeling">
                  {{ 'ICE: ' + somsOffender.CaseFactors[0].ice_value }}
                </span>
                <span class="data">
                  {{ somsOffender.CaseFactors[0].ice_flag ? 'Y' : 'N' }}
                </span>
                <br />
                <span class="labeling">
                  {{
                    'Retain ASU: ' + somsOffender.CaseFactors[0].retainASU_value
                  }}
                </span>
                <span class="data">
                  {{ somsOffender.CaseFactors[0].retainASU_flag }}
                </span>
                <br />
                <span class="labeling">
                  {{
                    'TransferMERD: ' +
                    somsOffender.CaseFactors[0].transferMERD_value
                  }}
                </span>
                <span class="data">
                  {{ somsOffender.CaseFactors[0].transferMERD_flag }}
                </span>
                <br /> -->
              </div>
              <div v-else></div>
            </v-col>
            <v-col cols="3" sm="6" md="3" lg="3">
              <span>Endorsement Information</span>
              <v-divider class="pb-2"></v-divider>
              <span class="labeling">Endorsed To: </span>
              <span class="data">{{ somsOffender.institution }}</span>
              <br />
              <span class="labeling">Original Date: </span>
              <!-- <span class="data">{{ somsOffender.endorseDate }}</span> -->
              <span class="data">{{
                transferData.originalEndorsementDate
              }}</span>
              <br />
              <span class="labeling">CurrentDate: </span>
              <!-- <span class="data">{{ somsOffender.institution }}</span> -->
              <span class="data">{{
                transferData.currentEndorsementDate
              }}</span>
              <br />
              <span class="labeling">Expiration Date: </span>
              <span class="data">{{
                transferData.expirationEndorsementDate
              }}</span>
            </v-col>
            <v-col cols="3" sm="6" md="3" lg="3">
              <span>Schedule Information</span>
              <v-divider class="pb-2"></v-divider>
              <span>
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
                  @change="scheduleSelected"
                ></v-select>
              </span>
              <span class="labeling">Vias: </span>
              <span class="data">{{ schedule.vias }}</span>
              <br />
              <!-- <span class="labeling">Via 2: </span>
              <span class="data">{{ schedule.via1 }}</span>
              <br /> -->
              <span class="labeling">Transfer Date: </span>
              <span class="data">{{ schedule.transferDate }}</span>
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
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div>
                <v-data-table
                  :items-per-page="itemsPerPage"
                  dense
                  :headers="holdsHeader"
                  :items="holds"
                  class="elevation-1"
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
                                  v-model="editedHoldItem.effectiveDate"
                                  label="Effective Date"
                                >
                                </v-text-field>
                              </v-col>
                              <v-col>
                                <v-text-field
                                  v-model="editedHoldItem.holdType"
                                  label="Reason/Hold Type"
                                >
                                </v-text-field>
                              </v-col>
                              <v-col>
                                <v-text-field
                                  v-model="editedHoldItem.expirationDate"
                                  label="Expiration Date"
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
                </v-data-table>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import somsOffender from '@/feathers/services/offender/details.service.js';
  // import transfer from '@/feathers/services/transfer/transfer.service.js';
  import { userplaceholder } from '@/assets/userplaceholder.js';
  import formatDate from '@/helpers/formatDate';
  import { get, sync, call } from 'vuex-pathify';
  import OffenderImage from '@/components/OffenderImage.vue';

  // import schedules from 'schedules.json';

  export default {
    name: 'Transfer',
    components: {
      OffenderImage,
    },
    data: () => ({
      //Imported Methods
      formatDate,
      dlgCancelForm: false,
      dlgSaveForm: false,
      loading: false,
      formValid: false,
      displayOffender: false,
      somsCDCRNumber: '',
      transferData: {
        offenderId: '',
        cdcrNumber: '',
        firstName: '',
        lastName: '',
        currentEndorsementDate: null,
        originalEndorsementDate: null,
        expirationEndorsementDate: null,
        transferDate: null,
        title: '', // FIXME remove
        scheduleId: '', // TODO update
        transferReasonCode: '',
        transferReasonDesc: '',
        cdcr135Comments: '',
        inHouseRemarks: '',
        isTransferred: false,
        isScheduled: false,
      },
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
        CaseFactors: {
          lifer_lwop_value: 'EPRD',
          lifer_lwop_flag: false,
          sny_value: 'EOP',
          sny_flag: false,
          cccms_eop_value: 'C',
          cccms_eop_flag: true,
          cocci1_value: 'Y',
          cocci1_flag: true,
          cocci2_value: 'Y',
          cocci2_flag: true,
          dpp_value: 'DPHDPS',
          dpp_flag: true,
          ddp_value: 'NCF',
          ddp_flag: false,
          ice_value: null,
          ice_flag: false,
          retainASU_value: null,
          retainASU_flag: false,
          transferMERD_value: null,
          transferMERD_flag: false,
        },
        // ATS Fields
        dateEndorsementOriginal: null,
        dateEndorsementCurrent: null,
        dateEndorsementExpiration: null,
        transferDate: null,
        isTransfered: false,
        // title: '',
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
        // { text: 'Number', value: 'number' },
        { text: 'Date', value: 'effectiveDate' },
        { text: 'Reason', value: 'holdType' },
        { text: 'Exp. Date', value: 'expirationDate' },
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
      holds: [],
      schedule: {
        scheduleId: 0,
        origin: '',
        destination: '',
        title: '',
        vias: [],
        transferDate: '',
        seats: 10,
        remainingSeats: 6,
      },
      via1: '',
      via2: '',
      transferDate: null,
      selSchedule: {},
      selTransferReason: {
        reasonCode: '',
        reasonDesc: '',
      },
      transferReasons: null,
    }),
    // created() {
    //   this.initialize();
    // },
    computed: {
      ...sync('transfers', ['transfers']),
      ...get('reasons', ['reasons']),
      ...get('schedules', ['schedules']),

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
    watch: {
      dlgEditCF(val) {
        val || this.cancelCaseFactor();
      },
      dlgDeleteCF(val) {
        val || this.cancelDeleteCaseFactor();
      },
    },
    methods: {
      ...call('transfers', [
        'createTransfer',
        'readTransfers',
        'updateTransfer',
        'deleteTransfer',
      ]),
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
            console.log('searchOffender(): offender => ', this.somsOffender);
            // this.holds = offenderInfo.data[0].TransferHolds;
            this.holds = this.somsOffender.TransferHolds;
            console.log('searchOffender(): holds => ', this.holds);
            // this.caseFactors = offenderInfo.data[0].caseFactors;
            this.caseFactors = this.somsOffender.CaseFactors;
            console.log('searchOffender(): caseFactors => ', this.caseFactors);
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
            this.transferData.cdcrNumber = this.somsOffender.cdcrNumber;
            this.transferData.offenderId = this.somsOffender.offenderId;
            this.transferData.firstName = this.somsOffender.firstName;
            this.transferData.lastName = this.somsOffender.lastName;
            this.transferData.currentEndorsementDate =
              this.somsOffender.endorseDate;
            this.transferData.originalEndorsementDate =
              this.somsOffender.dateEndorsementOriginal;
            this.transferData.transferDate = this.schedule.transferDate;
            this.transferData.title = this.schedule.title;
            this.transferData.scheduleId = this.schedule._id;
            this.transferData.transferReasonCode =
              this.selTransferReason.reasonCode;
            this.transferData.transferReasonDesc =
              this.selTransferReason.reasonDesc;
            this.transferData.cdcr135Comments = this.somsOffender.comments; // TODO Need to read from ATS db also
            this.transferData.inHouseRemarks = this.somsOffender.inHouseRemarks; // TODO Need to read from ATS db also
            setTimeout(() => {
              this.loading = false;
              this.displayOffender = true;
            }, 500);

            this.somsCDCRNumber = '';
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
      // filterHolds() {},
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
      scheduleSelected() {
        console.log(this.selSchedule);
        if (this.selSchedule == null) {
          return;
        }

        // for (let i = 0; i < this.schedules.length; i++) {
        for (let schedule of this.schedules) {
          // if (this.schedules[i].schedule == this.selSchedule) {
          if (schedule.title == this.selSchedule.title) {
            this.transferData.title = schedule.title; // FIXME
            this.transferData.scheduleId = schedule._id;
            this.transferData.transferDate = schedule.transferDate;
            this.transferData.institution = schedule.origin;
            break;
          }
        }
      },
      // transferReasonSelected
      transferReasonSelected() {
        console.log(
          'transferReasonSelected(): reason => ',
          this.selTransferReason
        );
        this.transferData.transferReasonCode =
          this.selTransferReason.reasonCode;
        this.transferData.transferReasonDesc =
          this.selTransferReason.reasonDesc;
      },
      // Cancel Form
      cancelForm() {
        this.dlgCancelForm = false;
      },
      async saveForm() {
        const self = this;
        // validate data
        // call api to send data to db
        // interrogate response - success or failure
        self.dlgSaveForm = false;
        self.transferData.isScheduled = true;

        console.log('saveForm(): transferData => ', self.transferData);
        if (self.transferData._id) {
          await self.updateTransfer(self.transferData);
        } else {
          await self.createTransfer(self.transferData);
          // show successful message
        }
        // const response = await transfer.create(this.transferData);
        // console.log('saveForm(): response => ', response);
        // response._id;
        // response.cdcrNumber;
        // setTimeout(() => {
        //   //   this.loading = false;
        //   alert('Save completed successfully!');
        //   // this.displayOffender = false;
        // }, 1000);
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
    height: 40px;
    width: 40px;
  }
  .photo-lg {
    height: 200px;
    /* width: 120px; */
  }
</style>
