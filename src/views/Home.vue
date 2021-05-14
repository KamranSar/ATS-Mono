<template>
  <v-container grid-list-md fluid>
    Welcome Home
    <v-btn @click="getUser()">Get Users</v-btn>
    <v-btn @click="getHeartbeat()">Get Heartbeat</v-btn>

    <Footer app></Footer>
  </v-container>
</template>

<script>
  import getNewToken from '@/config/private/getNewToken';
  import Footer from '@/components/layouts/Footer';
  import { Users } from '@/store/services/Users.js';
  import Heartbeat from '@/feathers/Heartbeat.js';
  export default {
    name: 'Home',
    components: {
      Footer,
    },
    methods: {
      async getUser() {
        await getNewToken();
        // TODO: Create a feathers class object to export the feathers client
        // and not have to create a global hook to check for expiration on the token
        const users = await Users.find();
        console.log('users: ', users);
      },
      async getHeartbeat() {
        const heartbeat = await Heartbeat.find();
        console.log('heartbeat: ', heartbeat);
      },
    },
  };
</script>
