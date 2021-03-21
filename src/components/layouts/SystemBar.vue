<template>
  <v-system-bar app>
    {{ secondsLeft }}
    <v-spacer></v-spacer>
    <v-icon v-show="isTokenExpiringSoon && !isTokenExpired" color="orange"
      >mdi-alarm</v-icon
    >
    <v-icon v-show="isOnline" color="green">mdi-access-point-check</v-icon>
    <v-icon v-show="!isOnline" color="red">mdi-access-point-off</v-icon>
  </v-system-bar>
</template>

<script>
  import { get, call } from 'vuex-pathify';

  export default {
    name: 'SystemBar',
    // router.replace({ name: 'home' });
    data() {
      return {
        secondsLeft: null,
      };
    },
    async created() {
      await this.delay(10000); // Wait before we start this timer or we go into a reload loop
      setInterval(async () => {
        this.secondsLeft = await this.calcSecondsToTokenExpire();
        if (
          this.secondsLeft !== null &&
          this.secondsLeft <= 0
          // this.isFeathersLoggedIn
        ) {
          await this.delay(1000); // Wait for the authentication to finish or we get router errors
          this.$router.push({ name: 'logout' });
          // this.$router.go(); // Force a page reload
        }
      }, 1000);
    },
    computed: {
      ...get('checkOnlineStatus', ['isOnline']),
      ...get('feathersAuthentication', [
        'isTokenExpiringSoon',
        'isTokenExpired',
        'isFeathersLoggedIn',
      ]),
    },
    methods: {
      ...call('feathersAuthentication', ['calcSecondsToTokenExpire']),
      async delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      },
    },
  };
</script>

<style scoped></style>
