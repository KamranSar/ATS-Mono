<template>
  <v-container grid-list-md fluid>
    Welcome Home
    <v-btn @click="getUser()">Get Users</v-btn>
    <Footer app></Footer>
  </v-container>
</template>

<script>
  import getNewToken from '@/config/private/getNewToken';
  import Footer from '@/components/layouts/Footer';
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
        const users = await this.$feathers.service('api/auth/v1/users').find();
        console.log('users: ', users);
      },
    },
  };
</script>
