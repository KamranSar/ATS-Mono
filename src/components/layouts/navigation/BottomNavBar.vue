<template>
  <v-bottom-navigation
    app
    grow
    :key="$route.currentPath"
    v-if="$vuetify.breakpoint.mdAndDown"
  >
    <NavButton
      v-for="(item, index) in BottomNavItems"
      :key="index"
      :item="item"
    ></NavButton>
  </v-bottom-navigation>
</template>

<script>
  import { BottomNavItems } from '@/router/routes.js';
  import NavButton from './helpers/NavButton.vue';
  export default {
    components: { NavButton },
    name: 'BottomNavBar',
    setup() {
      return {
        BottomNavItems,
      };
    },
  };
</script>
