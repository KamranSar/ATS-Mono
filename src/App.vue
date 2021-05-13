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
  import useVuexPathify from '@/compositions/useVuexPathify';
  import AppBar from '@/components/layouts/navigation/AppBar.vue';
  import NavDrawerLeft from '@/components/layouts/navigation/NavDrawerLeft.vue';
  import NavDrawerRight from '@/components/layouts/navigation/NavDrawerRight.vue';
  import Snackbar from '@/components/util/Snackbar.vue';
  import BottomNavBar from '@/components/layouts/navigation/BottomNavBar.vue';
  import Catch from '@/components/util/Catch.vue';

  // https://v3.vuejs.org/guide/composition-api-setup.html#setup
  export default {
    components: {
      AppBar,
      NavDrawerLeft,
      NavDrawerRight,
      Snackbar,
      BottomNavBar,
      Catch,
    },
    setup(props, context) {
      // Composition to use vuex-pathify setup function
      const { get, sync } = useVuexPathify(context);
      const userPrefs = sync('userPrefs', ['leftDrawOpen', 'rightDrawOpen']);
      const appFeatures = get('appFeatures', [
        'leftDrawEnabled',
        'rightDrawEnabled',
        'bottomBarEnabled',
      ]);

      return {
        ...userPrefs.value,
        ...appFeatures.value,
      };
    },
  };
</script>
