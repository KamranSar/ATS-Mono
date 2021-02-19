<template>
  <v-app>
    <system-bar v-if="systemBarEnabled"></system-bar>

    <AppBar
      :userItems="userItems"
      :adminItems="adminItems"
      :anonItems="anonItems"
      :anonNavItems="anonNavItems"
    ></AppBar>

    <v-navigation-drawer
      v-if="leftDrawEnabled"
      v-model="leftDrawOpen"
      clipped
      hide-overlay
      app
    >
      <!-- Items are passed from here since we may want to reuse these at 
          toolbar level at some point in time -->
      <NavDrawerLeft
        :userItems="userItems"
        :adminItems="adminItems"
        :anonItems="anonItems"
        :anonNavItems="anonNavItems"
      ></NavDrawerLeft>
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
      <!-- <v-container fluid> -->
      <!-- 
        The key refreshes component in some wierd cases. 
        You may or may not want this 
      -->
      <router-view :key="$route.fullPath" />
      <!-- </v-container> -->
    </v-main>

    <Footer
      v-if="footerEnabled"
      :userItems="userItems"
      :adminItems="adminItems"
      :anonItems="anonItems"
      :anonNavItems="anonNavItems"
    ></Footer>

    <BottomNavBar
      v-if="bottomBarEnabled"
      :userItems="userItems"
      :adminItems="adminItems"
      :anonItems="anonItems"
      :anonNavItems="anonNavItems"
    ></BottomNavBar>
  </v-app>
</template>

<script>
  import { sync, get } from 'vuex-pathify';

  export default {
    name: 'App',

    components: {
      SystemBar: () =>
        import(
          /* webpackChunkName: "default-system-bar" */
          '@/components/layouts/SystemBar'
        ),
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
      Footer: () =>
        import(
          /* webpackChunkName: "footer" */
          '@/components/layouts/Footer'
        ),
    },
    data() {
      return {
        clippedLeft: true,
        clippedRight: true,
        //  see here for icons: http://materialdesignicons.com/
        anonNavItems: [
          {
            title: 'How it works?',
            to: '/#howitworks',
            icon: 'mdi-lightbulb',
          },
          {
            title: 'Features',
            to: '/#features',
            icon: 'mdi-bug',
          },
          {
            title: 'Pricing',
            to: '/#pricing',
            icon: 'mdi-cash-multiple',
          },
        ],
        anonItems: [
          {
            title: 'Login',
            to: '/login',
            icon: 'mdi-fingerprint',
          },
          {
            title: 'Signup',
            to: '/signup',
            icon: 'mdi-account-box-outline',
          },
        ],
        userItems: [
          {
            icon: 'mdi-view-dashboard',
            title: 'Dashboard',
            to: '/dashboard',
            color: 'success',
          },
          {
            icon: 'mdi-book-plus',
            title: 'Service Request',
            to: '/sr',
          },
          {
            icon: 'mdi-bank',
            title: 'Partners',
            to: '/companies',
          },
        ],
        adminItems: [
          {
            icon: 'mdi-account-outline',
            title: 'Users',
            to: '/admin/users',
          },
          {
            icon: 'mdi-printer',
            title: 'Export Templates',
            to: '/admin/templates',
          },
        ],
        userToolbarItems: [
          {
            icon: 'mdi-folder-account',
            title: 'Account',
            to: '/my-account',
          },
          {
            icon: 'mdi-logout',
            title: 'Logout',
            to: '/logout',
          },
        ],
      };
    },
    computed: {
      ...sync('userprefs', ['leftDrawOpen', 'rightDrawOpen']),
      ...get('appfeatures', [
        'systemBarEnabled',
        'leftDrawEnabled',
        'rightDrawEnabled',
        'bottomBarEnabled',
        'footerEnabled',
      ]),
    },

    filters: {
      capitalize: (value) => {
        if (!value) return '';
        value = value.toString();
        return value.charAt(0).toUpperCase() + value.slice(1);
      },
      fmtCurrency: (value) => {
        if (!value) value = 0;
        return value.toLocaleString('en-IN', {
          style: 'currency',
          currency: 'INR',
        });
      },
    },
  };
</script>

<style>
  /* @import url("https://fonts.googleapis.com/css?family=Open Sans");
.v-application {
  font-family: "open sans";
} */

  /* .application {
  font-family: "open sans" !important;
} */

  @import './assets/css/main.css';
</style>
