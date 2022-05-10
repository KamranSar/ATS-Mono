<template>
  <v-card class="blue-grey lighten-4" min-width="200px" height="100%">
    <v-card-title>
      {{ title }}
    </v-card-title>
    <v-row no-gutters class="mx-4">
      <v-col cols="6">
        <v-select
          label="Endorsed To"
          placeholder="Endorsed To"
          :items="listOfInstitutions"
          item-text="institutionName"
          item-value="institutionId"
          v-model="selEndorsedTo"
          clearable
          dense
        >
          <template v-slot:item="{ item, on, attrs }">
            <v-list-item dense v-on="on" v-bind="attrs">
              <v-list-item-title>{{
                `${item.institutionId} - ${item.institutionName}`
              }}</v-list-item-title>
            </v-list-item>
          </template></v-select
        >
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-icon large color="primary" @click="createBusSeat">
          mdi-file-document
        </v-icon>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
  import { call, get } from 'vuex-pathify';
  import createBusSeat from '@/pdfs/createBusSeat.js';
  export default {
    name: 'BusSeatReportCard',
    data: () => ({
      title: 'Bus Seat Report',
      selEndorsedTo: '',
    }),
    computed: {
      ...get('institutions', ['listOfInstitutions', 'selectedInstitution']),
    },
    methods: {
      ...call('app', ['SET_SNACKBAR']),
      // createBusSeat()
      // Builds data for Bus Seat report
      // Calls createBusSeatPDF(data) to generate PDF report file
      // *******************************
      createBusSeat() {
        if (!this.selectedInstitution) {
          this.SET_SNACKBAR({
            top: true,
            message: 'Please select an Institution',
          });
          return;
        }

        if (this.selEndorsedTo === null) {
          this.selEndorsedTo = '';
        }
        createBusSeat(this.selEndorsedTo);
      },
    },
  };
</script>
