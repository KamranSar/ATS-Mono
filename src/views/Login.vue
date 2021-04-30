<template>
  <Panel title="Login">
    <template slot="content">
      <v-container grid-list-md class="pt-5">
        <v-row justify="center">
          <v-col md="12" v-for="i in 5" :key="i + 't'"></v-col>

          <v-col cols="12" class="text-center">
            <MicrosoftLoginButton
              :small="$vuetify.breakpoint.xs"
              :loading="authenticating"
              :disabled="authenticating"
              @click="signinButtonClicked"
            ></MicrosoftLoginButton>
          </v-col>

          <v-col md="12" v-for="i in 2" :key="i + 'b'"> </v-col>
        </v-row>
      </v-container>
    </template>
  </Panel>
</template>

<script>
  import { get, call } from 'vuex-pathify';

  export default {
    components: {
      Panel: () => import('@/components/layouts/Panel'),
      MicrosoftLoginButton: () =>
        import('@/components/layouts/buttons/SignInWithMicrosoftButton'),
    },

    data() {
      return {};
    },
    computed: {
      ...get('azureAuthentication', {
        myInfo: 'myInfo',
        myPhoto: 'myPhoto',
        myPhotoMetaData: 'myPhotoMetaData',
        localAccountId: 'localAccountId',
        azureLoading: 'azureLoading',
        azuretokenresponse: 'azuretokenresponse',
      }),
      ...get('feathersAuthentication', {
        isAuthenticated: 'isAuthenticated',
        isAuthenticatePending: 'isAuthenticatePending',
        errorOnAuthenticate: 'errorOnAuthenticate',
        user: 'user',
      }),

      ...get('app', ['loading']),
      authenticating() {
        return this.azureLoading || this.loading;
      },
    },
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
  };
</script>
