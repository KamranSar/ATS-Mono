<template>
  <v-row class="my-0 pt-2">
    <v-col cols="10" class="pb-1">
      <v-row no-gutters>
        <v-col cols="1">
          <offender-image
            height="50px"
            width="40px"
            :somsOffender="somsOffender"
            @click="showInfo('photo')"
          ></offender-image>
        </v-col>
        <v-col cols="4" class="pb-1">
          <div>
            <span class="font-weight-black black--text title pa-0 ma-0">
              {{ somsOffender.firstName + ' ' + somsOffender.lastName }}
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
      <!-- <v-divider class="pb-2"></v-divider> -->
    </v-col>
    <v-col cols="2" class="pb-1" align="right" align-self="center">
      <v-dialog v-model="dlgSaveForm" persistent max-width="500px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="secondary"
            v-bind="attrs"
            v-on="on"
            @click="dlgSaveForm = true"
            dense
            :disabled="disableSave"
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
              <v-btn
                color="primary"
                text
                @click="
                  dlgSaveForm = false;
                  saveForm();
                "
              >
                Yes
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
  import OffenderImage from '@/components/OffenderImage.vue';
  import { get, sync, call } from 'vuex-pathify';
  export default {
    name: 'TransferHeader',
    components: {
      OffenderImage,
    },
    data: () => ({
      dlgSaveForm: false,
      disableSave: true,
      btnInfo: true,
      btnHousing: true,
      btnPhysical: true,
      btnMedical: true,
    }),
    created() {
      // console.log(
      //   'TransferHeader: created(): loggedInUser/orgName => ',
      //   this.loggedInUser.somsinfo.organizationName
      // );
      // console.log(
      //   'TransferHeader: created(): offender/orgName => ',
      //   this.somsOffender.institutionName
      // );
      if (
        this.loggedInUser &&
        this.loggedInUser.somsinfo &&
        this.loggedInUser.somsinfo.organizationName &&
        this.loggedInUser.somsinfo.organizationName ===
          this.somsOffender.institutionName
      ) {
        this.disableSave = false; // Button enabled
      } else {
        this.disableSave = true; // Button disabled
      }
    },
    computed: {
      ...get('users', ['loggedInUser']),
      ...get('transfers', ['somsOffender']),
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
      showInfo(choice) {
        this.showSOMSData = choice == 'info' ? true : false;
        this.showPhoto = choice == 'photo' ? true : false;
        this.showHousing = choice == 'housing' ? true : false;
        this.showPhysical = choice == 'physical' ? true : false;
        this.showMedical = choice == 'medical' ? true : false;
        this.showComments = choice == 'comments' ? true : false;
      },
    },
  };
</script>
