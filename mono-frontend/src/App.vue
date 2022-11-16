<template>
  <v-app>
    <AppBar> </AppBar>

    <NavDrawerLeft v-if="LEFT_DRAW_ENABLED"></NavDrawerLeft>

    <NavDrawerRight v-if="RIGHT_DRAW_ENABLED" title="Right side Drawer">
      <template v-slot:content>
        <v-list>
          <v-list-item v-for="n in 5" :key="n" link>
            <v-list-item-content>
              <v-list-item-title>Item {{ n }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </NavDrawerRight>

    <Alert />
    <Snackbar />
    <TermsAndConditions />

    <v-main>
      <!-- Remove the transition tag if route transitions are not desired -->
      <transition name="slide-fade" mode="out-in">
        <router-view :key="$route.fullPath" />
      </transition>
    </v-main>

    <BottomNavBar v-if="BOTTOM_BAR_ENABLED"></BottomNavBar>
  </v-app>
</template>

<script>
  import AppBar from '@cdcr/vue-frontend/components/layouts/navigation/AppBar.vue';
  import NavDrawerLeft from '@cdcr/vue-frontend/components/layouts/navigation/NavDrawerLeft.vue';
  import NavDrawerRight from '@cdcr/vue-frontend/components/layouts/navigation/NavDrawerRight.vue';
  import Alert from '@cdcr/vue-frontend/components/util/Alert.vue';
  import Snackbar from '@cdcr/vue-frontend/components/util/Snackbar.vue';
  import BottomNavBar from '@cdcr/vue-frontend/components/layouts/navigation/BottomNavBar.vue';
  import TermsAndConditions from '@cdcr/vue-frontend/components/util/TermsAndConditions.vue';
  import { get } from 'vuex-pathify';
  import {
    LEFT_DRAW_ENABLED,
    RIGHT_DRAW_ENABLED,
    BOTTOM_BAR_ENABLED,
  } from '@/config/appFeatures.js';
  // https://v3.vuejs.org/guide/composition-api-setup.html#setup
  export default {
    components: {
      AppBar,
      NavDrawerLeft,
      NavDrawerRight,
      Alert,
      Snackbar,
      BottomNavBar,
      TermsAndConditions,
    },
    data: () => ({
      LEFT_DRAW_ENABLED,
      RIGHT_DRAW_ENABLED,
      BOTTOM_BAR_ENABLED,
    }),
    computed: {
      ...get('users', ['isUserLoggedIn']),
    },
  };
</script>

<style lang="scss">
  // Update or remove this if you don't want this scrollbar color
  @import '@cdcr/vue-frontend/styles/scrollbar.scss';

  // Update this file for any transitions not used in the app.
  @import '@cdcr/vue-frontend/styles/transitions.scss';

  // Uncomment this if you want to disable pull down to refresh
  // @import '@cdcr/vue-frontend/styles/overscroll.scss';
</style>
