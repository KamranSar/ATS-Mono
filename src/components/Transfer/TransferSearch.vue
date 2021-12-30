<template>
  <v-card-text>
    <v-row>
      <v-col cols="3">
        <h1 class="black--text">Transfer</h1>
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
          @click="searchOffender()"
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
  </v-card-text>
</template>

<script>
  import { sync, call } from 'vuex-pathify';

  export default {
    name: 'TransferSearch',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    data: () => ({}),
    computed: {
      ...sync('app', ['loading']),
      somsCDCRNumber: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        },
      },
    },
    methods: {
      ...call('ap', ['SET_SNACKBAR']),
      ...call('transfers', ['readOffenderDetails']),
      async searchOffender() {
        await this.readOffenderDetails(this.somsCDCRNumber);
      },
    },
    watch: {},
  };
</script>
