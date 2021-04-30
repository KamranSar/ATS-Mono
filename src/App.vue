<template>
  <v-app>
    <AppBar></AppBar>

    <NavDrawerLeft v-if="leftDrawEnabled"></NavDrawerLeft>

    <NavDrawerRight
      v-if="rightDrawEnabled"
      title="Right side Drawer"
      icon="fa-bar"
    >
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

    <v-main>
      <router-view :key="$route.fullPath" />
    </v-main>

    <BottomNavBar
      v-if="bottomBarEnabled && $vuetify.breakpoint.mdAndDown"
    ></BottomNavBar>
  </v-app>
</template>

<script>
  import { sync, get } from 'vuex-pathify';

  export default {
    name: 'App',

    components: {
      AppBar: () =>
        import(
          /* webpackChunkName: "app-bar" */
          '@/components/layouts/navigation/AppBar'
        ),
      NavDrawerLeft: () =>
        import(
          /* webpackChunkName: "nav-drawer-left" */
          '@/components/layouts/navigation/NavDrawerLeft'
        ),
      NavDrawerRight: () =>
        import(
          /* webpackChunkName: "nav-drawer-right" */
          '@/components/layouts/navigation/NavDrawerRight'
        ),
      Snackbar: () =>
        import(
          /* webpackChunkName: "snackbar" */
          '@/components/util/Snackbar'
        ),
      BottomNavBar: () =>
        import(
          /* webpackChunkName: "bottom-nav-bar" */
          '@/components/layouts/navigation/BottomNavBar'
        ),
    },
    data() {
      return {
        clippedLeft: true,
        clippedRight: true,
      };
    },
    computed: {
      ...sync('userprefs', ['leftDrawOpen', 'rightDrawOpen']),
      ...get('appfeatures', [
        'leftDrawEnabled',
        'rightDrawEnabled',
        'bottomBarEnabled',
      ]),
    },
  };
</script>
