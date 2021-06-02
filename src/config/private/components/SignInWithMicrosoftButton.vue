<template>
  <v-btn
    :loading="loading"
    :color="$vuetify.theme.dark ? '#2F2F2F' : '#FFFFFF'"
    ripple
    :tile="true"
    height="48px"
    elevation="3"
    @click="signinButtonClicked"
  >
    <v-img
      max-height="25px"
      max-width="25px"
      class="ml-n1 mr-3 pa-1"
      src="/img/ms-symbollockup_mssymbol_19.svg"
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
  import { call, get, sync } from 'vuex-pathify';
  import getNewToken from '@/config/private/helpers/getNewToken';

  export default {
    // https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-add-branding-in-azure-ad-apps
    name: 'SignInWithMicrosoftButton',
    methods: {
      ...call('azureAuthentication', ['AzureAuthentication']),
      ...call('alert', ['setAlertMsg']),
      ...call('users', {
        getUserRecord: 'get',
      }),
      ...call('snackbar', ['setSnack']),

      async signinButtonClicked() {
        this.setAlertMsg('');
        this.loading = true;
        try {
          // Sign in with azure
          await this.AzureAuthentication();
          try {
            await getNewToken();
            await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for the authentication to finish or we get router errors
            this.$router.push({ name: 'Home' });

            this.setSnack({
              message: `Logged into ${this.$myApp.name} successfully.`,
              color: 'success',
            });
          } catch (e1) {
            this.setAlertMsg(
              'API server Authentication failed. ' + e1.message || ''
            );
          } finally {
            this.loading = false;
          }
        } catch (e2) {
          this.setAlertMsg(
            'Sign in with Microsoft failed. ' + e2.message || ''
          );
        } finally {
          this.loading = false;
        }
      },
    },
    computed: {
      ...get('azureAuthentication', ['azureLoading', 'azuretokenresponse']),
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
