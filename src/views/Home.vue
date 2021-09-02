<template>
  <Panel>
    <template slot="content">
      <p>Welcome Home</p>

      <v-row justify="center">
        <v-btn class="mx-1" color="red lighten-4" @click="getHeartbeat()">
          <v-icon left color="red">mdi-heart</v-icon>
          Click for a heartbeat
          <v-icon right color="red">mdi-heart</v-icon>
        </v-btn>

        <v-btn class="mx-1" color="info darken-4" @click="getAppUserRoles()">
          <v-icon left color="info lighten-2">mdi-help-circle-outline</v-icon>
          Click to dump app user roles
          <v-icon right color="info lighten-2">mdi-help-circle-outline</v-icon>
        </v-btn>
      </v-row>

      <v-row justify="center" v-has-all-roles="['System Administrator']">
        <v-btn
          v-has-any-roles="['System Administrator', 'asdfkasdfasdf']"
          class="ma-1"
          color="primary"
        >
          Primary
        </v-btn>

        <v-btn class="ma-1" color="secondary"> Secondary </v-btn>
        <v-btn class="ma-1" color="accent"> Secondary </v-btn>
        <v-btn class="ma-1" color="error"> Error </v-btn>
        <v-btn class="ma-1" color="info" v-if="$hasAnyRoles(['Some Role'])">
          Info
        </v-btn>
        <v-btn class="ma-1" color="warning"> Warning </v-btn>
        <v-btn class="ma-1" color="success"> Success </v-btn>
        <v-btn class="ma-1" disabled> Disabled </v-btn>
      </v-row>

      <Footer app></Footer>
    </template>
  </Panel>
</template>

<script>
  /**
   * REQUIRED ROUTE: Home
   * This should be the first page a user sees when logging in.
   * Proceed by tearing this apart and make it your own.
   */
  import Panel from '@/components/layouts/Panel';
  import Footer from '@/components/layouts/Footer';
  import Heartbeat from '@/feathers/services/heartbeat/heartbeat.service.js';
  import findAll from '@/feathers/helpers/findAll';
  import { call } from 'vuex-pathify';

  export default {
    name: 'Home',
    components: {
      Footer,
      Panel,
    },
    data: () => {
      return {
        appUserRoles: [],
      };
    },
    methods: {
      ...call('app', ['SET_ALERT', 'SET_SNACKBAR']),
      /**
       * getAppUserRoles
       * Fetches everything from the appUserRoles table with the findAll helper.
       */
      async getAppUserRoles() {
        const ROLES_SVC_PATH = '/api/auth/v1/appuserroles';

        const appUserRoles = await findAll(ROLES_SVC_PATH);
        // console.log('appUserRoles: ', appUserRoles);
        this.appUserRoles = appUserRoles.data;

        this.toggleSnackbar(this.appUserRoles);

        return appUserRoles;
      },

      /**
       * getHeartBeat
       * Uses the Feathers Service we created for Heartbeat to directly call the find() method on the service.
       */
      async getHeartbeat() {
        const heartbeat = await Heartbeat.find();
        this.toggleAlert(heartbeat);
      },

      /**
       * toggleAlert
       * Uses the alert state from app module to set an alert for the App handle passed to the util Alert.vue
       *
       * @param {Object} options - The alert options with message being the only required
       */
      toggleAlert(message) {
        const options = {
          type: 'success',
          message: message,
          button: 'Click Me',
          onClick: () => {
            alert('Roll for initative!');
          },
        };
        this.SET_ALERT(options);
      },

      /**
       * toggleSnackbar
       * Uses the alert state from app module to set an alert for the App handle passed to the util Alert.vue
       *
       * @param {Object} options - The alert options with message being the only required
       */
      toggleSnackbar(message) {
        const options = {
          icon: 'mdi-account',
          color: 'info',
          message: message,
          bottom: true,
        };
        this.SET_SNACKBAR(options);
      },
    },
  };
</script>
