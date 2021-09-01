<template>
  <v-app>
    <AppBar></AppBar>

    <NavDrawerLeft></NavDrawerLeft>

    <NavDrawerRight title="Right side Drawer">
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
      <router-view :key="$route.fullPath" />
    </v-main>

    <BottomNavBar v-if="$vuetify.breakpoint.mdAndDown"></BottomNavBar>
  </v-app>
</template>

<script>
  import AppBar from '@/components/layouts/navigation/AppBar.vue';
  import NavDrawerLeft from '@/components/layouts/navigation/NavDrawerLeft.vue';
  import NavDrawerRight from '@/components/layouts/navigation/NavDrawerRight.vue';
  import Alert from '@/components/util/Alert.vue';
  import Snackbar from '@/components/util/Snackbar.vue';
  import BottomNavBar from '@/components/layouts/navigation/BottomNavBar.vue';

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
  };
</script>

<style>
  /* FIXME: Derive this from themes as --css-variable */

  /* Chrome, Safari */
  /** Begin Force Scroll Bar */
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar */
  /* TODO: Use an appropriate HEX value from your themes to set the background-color */
  ::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  ::-webkit-scrollbar:vertical {
    width: 10px;
  }

  ::-webkit-scrollbar:horizontal {
    height: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #517ca7;
    border: transparent;
  }

  ::-webkit-scrollbar-track {
    background-color: #517ca7;
    background: transparent;
  }
  /** Force Scroll Bar End */
</style>
