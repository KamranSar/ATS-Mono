<template>
  <v-app>
    <system-bar v-if="systemBarEnabled"></system-bar>

    <Toolbar></Toolbar>

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

    <Footer v-if="footerEnabled"></Footer>
    <NavDrawerBottom v-if="bottomBarEnabled"></NavDrawerBottom>
  </v-app>
</template>

<script>
  import Toolbar from '@/components/layouts/Toolbar';
  import Footer from '@/components/layouts/Footer';
  import { get } from 'vuex-pathify';

  export default {
    name: 'App',

    components: {
      Toolbar,
      Footer,
      SystemBar: () =>
        import(
          /* webpackChunkName: "default-system-bar" */
          '@/components/layouts/SystemBar'
        ),
      Snackbar: () =>
        import(
          /* webpackChunkName: "snackbar" */
          './components/util/Snackbar'
        ),
      NavDrawerBottom: () =>
        import(
          /* webpackChunkName: "nav-drawer-bottom" */
          '@/components/layouts/NavDrawerBottom'
        ),
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
    computed: {
      ...get('appfeatures', [
        'systemBarEnabled',
        'bottomBarEnabled',
        'footerEnabled',
      ]),
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
