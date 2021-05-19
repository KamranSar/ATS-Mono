<template>
  <Panel icon="mdi-view-dashboard" title="Home">
    <template slot="content">
      Welcome Home
      <pre class="text-truncate">
      <!-- {{ user }} -->
    </pre>
      <!-- <v-btn v-can:is-admin @click="getHeartbeat()">Get Heartbeat</v-btn> -->
      <button v-role:is-cool @click="toggleAlert('Cool guy eh?')">
        Can click me if cool
      </button>
      <button v-role:is-admin @click="toggleAlert('Do you feel powerful?')">
        Can click me if admin
      </button>

      <Footer app></Footer>
    </template>
  </Panel>
</template>

<script>
  import Panel from '@/components/layouts/Panel';
  import Footer from '@/components/layouts/Footer';
  import Heartbeat from '@/feathers/Heartbeat.js';
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
        console.log(this);
      },
      toggleAlert(message) {
        this.setAlertMsg(message);
        setTimeout(() => {
          this.setAlertMsg();
        }, 5000);
      },
    },
  };
</script>
