<template>
  <v-btn
    :loading="authenticating"
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
  import { call, get } from 'vuex-pathify';
  export default {
    // https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-add-branding-in-azure-ad-apps
    name: 'SignInWithMicrosoftButton',
    methods: {
      ...call('azureAuthentication', ['AzureAuthentication']),
      ...call('feathersAuthentication', ['authenticate']),
      ...call('alert', ['setAlertMsg']),
      ...call('users', {
        getUserRecord: 'get',
      }),
      ...call('snackbar', ['setSnack']),

      async signinButtonClicked() {
        this.setAlertMsg('');
        try {
          // Sign in with azure
          await this.AzureAuthentication();
          try {
            const packet = {
              strategy: 'azuretoken_v1.0',
              azuretokenresponse: this.azuretokenresponse, // Need the token from Azure to log into middle tier
              clientId: '', // FIXME:
            };
            // Now sign into Middle Tier
            // console.log(this.isAuthenticated);
            await this.authenticate(packet);
            // console.log(this.user);
            // const auth = await this.authenticate(packet);
            // console.log(auth._id);
            // const user = await this.getUserRecord(auth._id);
            // console.log(user);
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
          }
        } catch (e2) {
          this.setAlertMsg(
            'Sign in with Microsoft failed. ' + e2.errorMessage || ''
          );
        }
      },
    },
    computed: {
      ...get('azureAuthentication', ['azureLoading', 'azuretokenresponse']),
      ...get('app', ['loading']),
      authenticating() {
        return this.azureLoading || this.loading;
      },
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
