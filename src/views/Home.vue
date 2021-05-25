<template>
  <Panel icon="mdi-view-dashboard" title="Home">
    <template slot="content">
      <p>Welcome Home</p>

      <v-btn
        v-role:is-admin
        color="success"
        @click="toggleAlert('Do you feel powerful?')"
      >
        Can click me if admin
      </v-btn>

      <Footer app></Footer>
    </template>
  </Panel>
</template>

<script>
  import Panel from '@/components/layouts/Panel';
  import Footer from '@/components/layouts/Footer';
  import Heartbeat from '@/feathers/services/heartbeat/heartbeat.service.js';
  import { call } from 'vuex-pathify';
  export default {
    name: 'Home',
    components: {
      Footer,
      Panel,
    },
    methods: {
      ...call('alert', ['setAlertMsg']),
      async getHeartbeat() {
        const heartbeat = await Heartbeat.find();
        console.log('heartbeat: ', heartbeat);
      },
      toggleAlert(message) {
        this.setAlertMsg(message);
        this.getHeartbeat();
        setTimeout(() => {
          this.setAlertMsg();
        }, 5000);
      },
    },
  };
</script>
