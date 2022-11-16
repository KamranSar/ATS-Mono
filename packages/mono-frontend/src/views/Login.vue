<template>
  <Panel title="Login" noLoading>
    <template slot="content">
      <v-container grid-list-md class="pt-5">
        <v-row justify="center" align="center">
          <AppLogo noLoading size="100%" class="mt-12" />

          <v-col cols="12" v-for="i in 4" :key="i + 't'"></v-col>

          <transition name="fade" mode="in-out">
            <v-col
              cols="12"
              xl="8"
              class="text-center"
              v-if="showSomsImpersonation"
            >
              <SomsLoginForm
                v-if="showSomsImpersonation"
                v-model="impersonatedSomsUPN"
              />
            </v-col>
          </transition>
          <v-col cols="12" xl="8" class="text-center">
            <MTLoginForm noLoading />
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
  import AppLogo from '@cdcr/vue-frontend/components/util/AppLogo.vue';
  import SomsLoginForm from '@cdcr/vue-frontend/components/Login/SomsLoginForm.vue';
  import MTLoginForm from '@cdcr/vue-frontend/components/Login/MTLoginForm.vue';
  export default {
    name: 'Login',
    components: {
      Panel: () => import('@cdcr/vue-frontend/components/layouts/Panel'),
      SomsLoginForm,
      AppLogo,
      MTLoginForm,
    },
    data: () => {
      return {
        impersonatedSomsUPN: '', // Comes from sessionStorage
        showSomsImpersonation: false,
      };
    },
    methods: {
      toggleSomsImpersonation() {
        this.showSomsImpersonation = !this.showSomsImpersonation;
        if (!this.showSomsImpersonation) {
          this.impersonatedSomsUPN = '';
        }
      },
    },
  };
</script>
