<template>
  <Panel title="Login">
    <template slot="content">
      <v-container grid-list-md class="pt-5">
        <v-form
          ref="form"
          v-model="validInput"
          @submit.prevent="validateAndLogin"
        >
          <v-row justify="center">
            <v-col md="12" v-for="i in 5" :key="i + 't'"></v-col>
            <v-col cols="12" class="text-center">
              <MicrosoftLoginButton
                :small="$vuetify.breakpoint.xs"
                @click="signinButtonClicked"
              ></MicrosoftLoginButton>
            </v-col>
            <v-col md="12" v-for="i in 2" :key="i + 'b'"></v-col>
          </v-row>
        </v-form>
      </v-container>
    </template>
  </Panel>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex';
  import { sync } from 'vuex-pathify';

  import PgtUtilMix from '../mixins/PgtUtilMix.vue';

  export default {
    components: {
      Panel: () => import('../components/layouts/Panel'),
      MicrosoftLoginButton: () =>
        import('@/components/layouts/buttons/SignInWithMicrosoftButton'),
    },

    mixins: [PgtUtilMix],

    data() {
      return {
        validInput: true,
        passShow: false,
      };
    },
    computed: {
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
      ...mapActions('authentication', ['login', 'resetPasswordInitiate']),
      ...mapMutations('alert', ['setAlert']),
      ...mapMutations('snackbar', ['setSnack']),

      signinButtonClicked() {
        console.log('Microsoft Clicked');
      },

      validateAndLogin() {
        if (this.$refs.form.validate()) {
          // this.login();
        }
      },

      confirmAndPassReset() {
        if (this.registerUserId != '') {
          window.confirm('Do you want to reset your password?') &&
            this.resetPasswordInitiate();
        } else {
          window.alert('Enter your user id to reset password.');
        }
      },
    },
  };
</script>
