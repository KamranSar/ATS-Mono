<template>
  <Panel icon="mdi-view-dashboard" title="Home">
    <template slot="content">
      Welcome Home
      <pre class="text-truncate">
      <!-- {{ user }} -->
    </pre>
      <!-- <v-btn v-can:is-admin @click="getHeartbeat()">Get Heartbeat</v-btn> -->
      <button v-role:is-cool>Click me if cool</button>
      <button v-role:admin>Click me if admin</button>

      <Footer app></Footer>
    </template>
  </Panel>
</template>

<script>
  import Panel from '@/components/layouts/Panel';
  import Footer from '@/components/layouts/Footer';
  import Heartbeat from '@/feathers/Heartbeat.js';
  import { sync } from 'vuex-pathify';
  export default {
    name: 'Home',
    components: {
      Footer,
      Panel,
    },
    methods: {
      async getHeartbeat() {
        const heartbeat = await Heartbeat.find();
        console.log('heartbeat: ', heartbeat);
        console.log(this);
      },
    },
    computed: {
      ...sync('users', ['user']),
    },
  };
</script>
