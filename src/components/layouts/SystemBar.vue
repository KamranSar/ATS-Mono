<template>
  <v-system-bar app>
    <v-spacer></v-spacer>
    <v-icon v-show="isOnline" color="green">mdi-access-point-check</v-icon>
    <v-icon v-show="!isOnline" color="red">mdi-access-point-off</v-icon>
  </v-system-bar>
</template>

<script>
  import { get } from 'vuex-pathify';

  export default {
    name: 'SystemBar',
    data() {
      return {};
    },
    async created() {},
    computed: {
      ...get('checkOnlineStatus', ['isOnline']),
      ...get('feathersAuthentication', [
        'isTokenExpiringSoon',
        'isTokenExpired',
        'isFeathersLoggedIn',
      ]),
    },
    methods: {
      async delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      },
    },
  };
</script>

<style scoped></style>
