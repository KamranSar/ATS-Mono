<template>
  <v-app>
    <Catch label="AppBar">
      <AppBar></AppBar>
    </Catch>

    <Catch label="LeftNav">
      <NavDrawerLeft v-if="leftDrawEnabled"></NavDrawerLeft>
    </Catch>

    <Catch label="RightNav">
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
    </Catch>

    <Catch label="Snackbar">
      <Snackbar />
    </Catch>

    <Catch label="Main">
      <v-main>
        <router-view :key="$route.fullPath" />
      </v-main>
    </Catch>

    <Catch label="BottomNav">
      <BottomNavBar
        v-if="bottomBarEnabled && $vuetify.breakpoint.mdAndDown"
      ></BottomNavBar>
    </Catch>
  </v-app>
</template>

<script>
  import { sync, get } from 'vuex-pathify';
  import AppBar from '@/components/layouts/navigation/AppBar.vue';
  import NavDrawerLeft from '@/components/layouts/navigation/NavDrawerLeft.vue';
  import NavDrawerRight from '@/components/layouts/navigation/NavDrawerRight.vue';
  import Snackbar from '@/components/util/Snackbar.vue';
  import BottomNavBar from '@/components/layouts/navigation/BottomNavBar.vue';
  import Catch from '@/components/util/Catch.vue';
  export default {
    name: 'App',
    components: {
      AppBar,
      NavDrawerLeft,
      NavDrawerRight,
      Snackbar,
      BottomNavBar,
      Catch,
    },
    data() {
      return {
        clippedLeft: true,
        clippedRight: true,
      };
    },
    computed: {
      ...sync('userPrefs', ['leftDrawOpen', 'rightDrawOpen']),
      ...get('appFeatures', [
        'leftDrawEnabled',
        'rightDrawEnabled',
        'bottomBarEnabled',
      ]),
    },
  };
</script>
