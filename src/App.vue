<template>
  <v-app>
    <AppBar></AppBar>

    <v-navigation-drawer
      v-if="leftDrawEnabled"
      v-model="leftDrawOpen"
      clipped
      hide-overlay
      app
    >
      <!-- Items are passed from here since we may want to reuse these at 
          toolbar level at some point in time -->
      <NavDrawerLeft></NavDrawerLeft>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-if="rightDrawEnabled"
      v-model="rightDrawOpen"
      clipped
      hide-overlay
      app
      right
    >
      <NavDrawerRight title="Right side Drawer" icon="mdi-view-dashboard">
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
    </v-navigation-drawer>

    <Snackbar />

    <v-main>
      <!-- 
        The key refreshes component in some wierd cases. 
        You may or may not want this:
        <router-view :key="$route.fullPath" />
      -->
      <router-view />
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
          '@/components/layouts/AppBar'
        ),
      NavDrawerLeft: () =>
        import(
          /* webpackChunkName: "nav-drawer-left" */
          '@/components/layouts/NavDrawerLeft'
        ),
      NavDrawerRight: () =>
        import(
          /* webpackChunkName: "nav-drawer-right" */
          '@/components/layouts/NavDrawerRight'
        ),
      Snackbar: () =>
        import(
          /* webpackChunkName: "snackbar" */
          '@/components/util/Snackbar'
        ),
      BottomNavBar: () =>
        import(
          /* webpackChunkName: "bottom-nav-bar" */
          '@/components/layouts/BottomNavBar'
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
        'systemBarEnabled',
        'leftDrawEnabled',
        'rightDrawEnabled',
        'bottomBarEnabled',
      ]),
      ...get('azureAuthentication', {
        myInfo: 'myInfo',
        myPhoto: 'myPhoto',
        myPhotoMetaData: 'myPhotoMetaData',
        localAccountId: 'localAccountId',
        displayName: 'displayName',
        isAzureLoggedIn: 'isAzureLoggedIn',
      }),
      ...get('feathersAuthentication', {
        isFeathersLoggedIn: 'isFeathersLoggedIn',
        isAuthenticatePending: 'isAuthenticatePending',
      }),
    },
  };
</script>

<style>
  @import './assets/css/main.css';
</style>
