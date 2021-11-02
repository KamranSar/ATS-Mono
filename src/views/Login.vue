<template>
  <Panel title="Login">
    <template slot="content">
      <v-container grid-list-md class="pt-5">
        <v-row justify="center">
          <v-col md="12" v-for="i in 5" :key="i + 't'"></v-col>

          <transition name="fade" mode="in-out">
            <v-col
              :cols="$vuetify.breakpoint.smAndDown ? 12 : 6"
              class="text-center"
              v-if="showSomsImpersonation"
            >
              <v-form v-model="valid" lazy-validation>
                <v-text-field
                  id="soms-username-field"
                  v-model="impersonatedSomsUPN"
                  label="Enter a SOMS Email"
                  type="email"
                  hint="FIRST.LAST@CDCR.CA.GOV"
                  filled
                  clearable
                  autofocus
                  prepend-inner-icon="mdi-account"
                  :disabled="loading"
                  :rules="emailRules"
                >
                  <template v-slot:append>
                    <v-menu offset-y>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn class="mt-n1 pb-1" v-bind="attrs" v-on="on" icon>
                          <v-icon>mdi-help-circle</v-icon>
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-text class="pa-6">
                          <h4 class="text-center">HOW TO</h4>
                          <ol>
                            <li v-for="step in howto" :key="step">
                              {{ step }}
                            </li>
                          </ol>
                        </v-card-text>
                      </v-card>
                    </v-menu>
                  </template>
                </v-text-field>
              </v-form>
            </v-col>
          </transition>
          <v-col cols="12" class="text-center">
            <MicrosoftLoginButton
              :disabled="loading || !valid"
            ></MicrosoftLoginButton>
          </v-col>

          <v-col md="12" v-for="i in 2" :key="i + 'b'"> </v-col>
        </v-row>
      </v-container>

      <v-footer app padless color="transparent" v-if="!$myApp.isPrd">
        <v-card class="flex" flat tile
          ><v-card-title class="py-2">
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-on="on"
                  v-bind="attrs"
                  icon
                  @click="toggleSomsImpersonation()"
                  ><v-icon>mdi-account-supervisor</v-icon></v-btn
                >
              </template>
              <span class="white--text">Impersonate a SOMS Users</span>
            </v-tooltip>
          </v-card-title>
        </v-card>
      </v-footer>
    </template>
  </Panel>
</template>

<script>
  /**
   * REQUIRED ROUTE: Login
   */
  import { sync } from 'vuex-pathify';
  export default {
    name: 'Login',
    components: {
      Panel: () => import('@/components/layouts/Panel'),
      MicrosoftLoginButton: () =>
        import('@/config/private/components/SignInWithMicrosoftButton'),
    },
    data: () => {
      return {
        impersonatedSomsUPN: '', // Comes from sessionStorage
        showSomsImpersonation: false,
        valid: true,
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        howto: [
          'Enter a SOMS Email Address',
          'Sign in with Microsoft using your account',
          'Left Nav will show the SOMS Display Name',
        ],
      };
    },
    created() {
      this.impersonatedSomsUPN =
        sessionStorage.getItem('impersonatedSomsUPN') || '';
    },
    computed: {
      ...sync('app', ['loading']),
    },
    methods: {
      toggleSomsImpersonation() {
        this.showSomsImpersonation = !this.showSomsImpersonation;

        // Validate and reset to empy string when invalid.
        if (!this.showSomsImpersonation && !this.valid) {
          this.impersonatedSomsUPN = '';
          this.valid = true;
        }
      },
      updatedSomsUPN(value) {
        sessionStorage.setItem(
          'impersonatedSomsUPN',
          value ? value.toUpperCase() : ''
        );
      },
    },
    watch: {
      impersonatedSomsUPN: {
        handler: 'updatedSomsUPN',
      },
    },
  };
</script>
