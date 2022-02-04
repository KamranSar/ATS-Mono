<template>
  <v-btn
    :loading="loading"
    :color="$vuetify.theme.dark ? '#2F2F2F' : '#FFFFFF'"
    ripple
    :tile="true"
    height="48px"
    elevation="3"
    @click="signinButtonClicked"
    v-bind="$attrs"
  >
    <v-img
      max-height="25px"
      max-width="25px"
      class="ml-n1 mr-3 pa-1"
      :src="`${$myApp.publicPath}${imgLocation}`"
    ></v-img>
    <span
      class="buttonText"
      :style="{ color: $vuetify.theme.dark ? '#ffffff' : '#5E5E5E' }"
    >
      <div v-if="$vuetify.breakpoint.xs">Sign in</div>
      <div v-else>Sign in with Microsoft</div>
    </span>
  </v-btn>
</template>

<script>
  import { call, sync } from 'vuex-pathify';
  import getNewToken from '@/config/private/helpers/getNewToken';
  import onInit from '@/config/hooks/onInit.js';
  import onLogin from '@/config/hooks/onLogin.js';
  import clearMsalTokens from '@/config/private/helpers/clearMsalTokens';

  export default {
    // https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-add-branding-in-azure-ad-apps
    name: 'SignInWithMicrosoftButton',
    data: () => ({
      imgLocation: '/img/ms-symbollockup_mssymbol_19.svg',
    }),
    methods: {
      ...call('app', ['SET_SNACKBAR']),
      ...call('azureAuthentication', ['AzureAuthentication']),

      async signinButtonClicked() {
        this.loading = true;
        try {
          this.SET_SNACKBAR({
            top: true,
            center: true,
            message: `Logging in...`,
            color: 'success',
          });

          // Sign in with azure
          await this.AzureAuthentication();
          try {
            await getNewToken();
            await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for the authentication to finish or we get router errors
            await onLogin();
            await onInit();

            this.$router.push({ name: 'Home' });
            this.SET_SNACKBAR({
              top: true,
              center: true,
              message: `Logged into ${this.$myApp.name} successfully.`,
              color: 'success',
            });
          } catch (e1) {
            console.error(e1);
            this.SET_SNACKBAR({
              top: true,
              center: true,
              message: 'User cancelled or authentication failed.',
              color: 'error',
            });
            clearMsalTokens();
          } finally {
            this.loading = false;
          }
        } catch (e2) {
          console.error(e2);
          this.SET_SNACKBAR({
            top: true,
            center: true,
            message: 'Sign in with Microsoft failed, please try again later.',
            color: 'error',
          });
        } finally {
          this.loading = false;
        }
      },
    },
    computed: {
      ...sync('app', ['loading']),
    },
  };
</script>

<style lang="scss" scoped>
  span.buttonText {
    font-size: 16px;
    font-weight: 600;
    /* Use the font that is loaded in the <head> */
    font-family: 'Segoe UI', 'Roboto', sans-serif;
  }
  .v-btn {
    text-transform: none !important;
  }
</style>
