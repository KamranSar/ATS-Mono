<template>
  <v-row class="my-0 pt-2">
    <v-col cols="10" class="pb-1">
      <v-row no-gutters>
        <v-col cols="4">
          <table>
            <tr>
              <td rowspan="2" class="pr-1">
                <offender-image
                  height="50px"
                  width="40px"
                  :somsOffender="somsOffender"
                  @click="showInfo('photo')"
                  style="border: 1px solid gray"
                ></offender-image>
              </td>
              <td>
                <font class="font-weight-black black--text title">
                  {{ somsOffender.firstName + ' ' + somsOffender.lastName }}
                </font>
              </td>
            </tr>
            <tr>
              <td>
                {{ somsOffender.institutionName }}
              </td>
            </tr>
          </table>
        </v-col>
        <v-col cols="3" class="pb-1" align-self="center">
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
      <!-- <v-divider class="pb-2"></v-divider> -->
      <v-spacer></v-spacer>
    </v-col>
    <v-col cols="2" class="pb-1" align="right" align-self="center">
      <v-dialog v-model="dlgSaveForm" persistent max-width="500px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :disabled="loading"
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
            <v-toolbar color="primary" dark> Confirm Transfer </v-toolbar>
            <v-card-text>
              <div class="text-h6 pa-12">
                Confirm transfer by clicking Yes or No.
              </div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn color="primary" text @click="dlgSaveForm = false">
                No
              </v-btn>
              <v-btn color="primary" text @click="saveTransfer"> Yes </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
  import OffenderImage from '@/components/OffenderImage.vue';
  import formatCaseFactors from '@/helpers/formatCaseFactors';
  import { get, sync, call } from 'vuex-pathify';
  export default {
    name: 'TransferHeader',
    components: {
      OffenderImage,
    },
    data: () => ({
      dlgSaveForm: false,
      btnInfo: true,
      btnHousing: true,
      btnPhysical: true,
      btnMedical: true,
    }),
    // created() {
    //   console.log(
    //     `TransferHeader::created(): users institution: ${this.loggedInUser.somsinfo.organizationName}`
    //   );
    //   console.log(
    //     `TransferHeader::created(): offender institution: ${this.somsOffender.institutionName}`
    //   );
    //   if (
    //     this.loggedInUser &&
    //     this.loggedInUser.somsinfo &&
    //     this.loggedInUser.somsinfo.organizationName &&
    //     this.loggedInUser.somsinfo.organizationName ===
    //       this.somsOffender.institutionName
    //   ) {
    //     console.log(`created(): institutions match`);
    //   } else {
    //     console.log(`created(): institutions do not match`);
    //   }
    // },
    computed: {
      ...get('app', ['loading']),
      ...get('users', ['loggedInUser']),
      ...get('transfers', ['transferData', 'somsOffender']),
      ...sync('institutions', ['listOfInstitutions']),
      ...sync('transfers', [
        'showSOMSData',
        'showHousing',
        'showPhysical',
        'showMedical',
        'showPhoto',
        'showComments',
      ]),
    },
    methods: {
      ...call('transfers', ['saveForm']),
      ...call('app', ['SET_SNACKBAR']),
      setSnackbar(msg, result, timeout) {
        this.SET_SNACKBAR({
          top: true,
          center: true,
          message: msg,
          color: result,
          timeout: timeout,
        });
      },
      showInfo(choice) {
        this.showSOMSData = choice == 'info' ? true : false;
        this.showPhoto = choice == 'photo' ? true : false;
        this.showHousing = choice == 'housing' ? true : false;
        this.showPhysical = choice == 'physical' ? true : false;
        this.showMedical = choice == 'medical' ? true : false;
        this.showComments = choice == 'comments' ? true : false;
      },

      async saveTransfer() {
        this.dlgSaveForm = false;
        try {
          // console.log(
          //   'saveTransfer(): this.listOfInstitutions => ',
          //   this.listOfInstitutions
          // );
          // console.log(
          //   'saveTransfer(): this.transferData => ',
          //   this.transferData
          // );
          let objIns = this.listOfInstitutions.find(
            (inst) =>
              this.transferData &&
              this.transferData.institutionName &&
              this.transferData.institutionName === inst.institutionName
          );
          // console.log('saveRemarks(): objIns => ', objIns);
          if (objIns) {
            this.transferData.institutionId = objIns.institutionId;
            // console.log(
            //   'saveTransfer(): this.transferData.institutionId => ',
            //   this.transferData.institutionId
            // );
          }

          this.transferData.caseFactor = formatCaseFactors(this.somsOffender);

          objIns = this.listOfInstitutions.find(
            (inst) =>
              this.transferData &&
              this.transferData.endorsedToName &&
              inst.institutionName === this.transferData.endorsedToName
          );
          if (objIns) {
            if (!this.transferData.endorsedToName) {
              this.transferData.endorsedToName = objIns.institutionName;
            }
            if (!this.transferData.endorsedToId) {
              this.transferData.endorsedToId = objIns.institutionId;
            }
            if (!this.transferData.endorsedToPartyId) {
              this.transferData.endorsedToPartyId = objIns.institutionPartyId;
            }
          }

          const response = await this.saveForm();
          if (response) {
            // setSnackbar successful
            this.setSnackbar('Successfully saved form!', 'succesful', 2000);
          } else {
            // setSnackbar error
            this.setSnackbar('Error saving form!', 'error', 6000);
          }
        } catch (ex) {
          console.error(ex);
          this.setSnackbar(`ERROR! An error occurred saving the form.`);
        }
      },
    },
  };
</script>
