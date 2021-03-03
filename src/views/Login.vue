<template>
  <Panel title="Login">
    <template slot="content">
      <v-container grid-list-md class="pt-5">
        <v-row justify="center">
          <v-col md="12" v-for="i in 5" :key="i + 't'"></v-col>

          <v-col cols="12" class="text-center">
            <MicrosoftLoginButton
              :small="$vuetify.breakpoint.xs"
              :loading="azureLoading"
              :disabled="azureLoading"
              @click="signinButtonClicked"
            ></MicrosoftLoginButton>
          </v-col>

          <v-col md="12" v-for="i in 2" :key="i + 'b'"></v-col>
        </v-row>
      </v-container>
    </template>
  </Panel>
</template>

<script>
  // import { mapMutations, mapActions } from 'vuex';
  import { get, sync, call } from 'vuex-pathify';

  export default {
    components: {
      Panel: () => import('@/components/layouts/Panel'),
      MicrosoftLoginButton: () =>
        import('@/components/layouts/buttons/SignInWithMicrosoftButton'),
    },

    data() {
      return {
        validInput: true,
        passShow: false,
      };
    },
    computed: {
      ...get('azureAuthentication', {
        azureLoading: 'loading',
        myInfo: 'myInfo',
        myPhoto: 'myPhoto',
        myPhotoMetaData: 'myPhotoMetaData',
        localAccountId: 'localAccountId',
      }),
      ...sync('authentication', [
        'registerUserId',
        'registerEmail',
        'registerPass',
        'registerError',
      ]),
    },
    methods: {
      // ...mapMutations("authentication", [
      //   "setRegisterUserId",
      //   "setRegisterPass",
      //   "setRegisterError"
      // ]),
      ...call('azureAuthentication', ['AzureAuthentication']),
      // ...mapActions('authentication', ['login', 'resetPasswordInitiate']),
      // ...mapMutations('alert', ['setAlert']),
      // ...mapMutations('snackbar', ['setSnack']),

      signinButtonClicked() {
        this.AzureAuthentication();
      },
    },
  };
</script>
