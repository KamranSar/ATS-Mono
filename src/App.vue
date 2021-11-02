<template>
  <v-app>
    <AppBar></AppBar>

    <NavDrawerLeft v-if="LEFT_DRAW_ENABLED" />

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

    <v-main>
      <!-- Remove the transition tag if route transitions are not desired -->
      <transition name="slide-fade" mode="out-in">
        <router-view :key="$route.fullPath" />
      </transition>
    </v-main>

    <BottomNavBar v-if="BOTTOM_BAR_ENABLED" />
  </v-app>
</template>

<script>
  import AppBar from '@/components/layouts/navigation/AppBar.vue';
  import NavDrawerLeft from '@/components/layouts/navigation/NavDrawerLeft.vue';
  import NavDrawerRight from '@/components/layouts/navigation/NavDrawerRight.vue';
  import Alert from '@/components/util/Alert.vue';
  import Snackbar from '@/components/util/Snackbar.vue';
  import BottomNavBar from '@/components/layouts/navigation/BottomNavBar.vue';
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
  @import '@/styles/scrollbar.scss';

  // Update this file for any transitions not used in the app.
  @import '@/styles/transitions.scss';

  // Uncomment this if you want to enable pull down to refresh
  // @import '@/styles/overscroll.scss';
</style>
