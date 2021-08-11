<template>
  <Panel icon="mdi-view-dashboard" title="Home">
    <template slot="content">
      <p>Welcome Home</p>

      <v-row justify="center">
        <v-btn class="mr-2" color="red lighten-4" @click="getHeartbeat()">
          <v-icon left color="red">mdi-heart</v-icon>
          Click for a heartbeat
          <v-icon right color="red">mdi-heart</v-icon>
        </v-btn>

        <v-btn color="info darken-4" @click="getAppUserRoles()">
          <v-icon left color="info lighten-2">mdi-help-circle-outline</v-icon>
          Click to dump app user roles
          <v-icon right color="info lighten-2">mdi-help-circle-outline</v-icon>
        </v-btn>
      </v-row>

      <v-row>
        {{ appUserRoles }}
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
      ...call('alert', ['setAlertMsg']),
      /**
       * getAppUserRoles
       * Fetches everything from the appUserRoles table with the findAll helper.
       */
      async getAppUserRoles() {
        const ROLES_SVC_PATH = '/api/auth/v1/appuserroles';

        const appUserRoles = await findAll(ROLES_SVC_PATH);
        // console.log('appUserRoles: ', appUserRoles);
        this.appUserRoles = appUserRoles.data;
        return appUserRoles;
      },

      /**
       * getHeartBeat
       * Uses the Feathers Service we created for Heartbeat to directly call the find() method on the service.
       */
      async getHeartbeat() {
        const heartbeat = await Heartbeat.find();
        this.toggleAlert(heartbeat);
        console.log('heartbeat: ', heartbeat);
      },

      /**
       * toggleAlert
       * Uses the alert module to call setAlertMsg handle passed to the util Alert.vue
       *
       * @param {String} message - The message string
       */
      toggleAlert(message) {
        this.setAlertMsg(message);

        const seconds = 1000; // 1000 ms
        setTimeout(() => {
          this.setAlertMsg();
        }, 5 * seconds);
      },
    },
  };
</script>
