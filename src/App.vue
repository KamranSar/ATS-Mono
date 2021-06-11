<template>
  <v-app>
    <AppBar></AppBar>

    <NavDrawerLeft v-if="leftDrawEnabled"></NavDrawerLeft>

    <NavDrawerRight v-if="rightDrawEnabled" title="Right side Drawer">
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

    <Snackbar />

    <!-- <Catch label="Main"> -->
    <v-main>
      <router-view :key="$route.fullPath" />
    </v-main>
    <!-- </Catch> -->

    <BottomNavBar
      v-if="bottomBarEnabled && $vuetify.breakpoint.mdAndDown"
    ></BottomNavBar>
  </v-app>
</template>

<script>
  import { get } from 'vuex-pathify';
  import AppBar from '@/components/layouts/navigation/AppBar.vue';
  import NavDrawerLeft from '@/components/layouts/navigation/NavDrawerLeft.vue';
  import NavDrawerRight from '@/components/layouts/navigation/NavDrawerRight.vue';
  import Snackbar from '@/components/util/Snackbar.vue';
  import BottomNavBar from '@/components/layouts/navigation/BottomNavBar.vue';
  // import Catch from '@/components/util/Catch.vue';

  // https://v3.vuejs.org/guide/composition-api-setup.html#setup
  export default {
    components: {
      AppBar,
      NavDrawerLeft,
      NavDrawerRight,
      Snackbar,
      BottomNavBar,
      // Catch,
    },
    computed: {
      ...get('appFeatures', [
        'leftDrawEnabled',
        'rightDrawEnabled',
        'bottomBarEnabled',
      ]),
    },
  };
</script>
