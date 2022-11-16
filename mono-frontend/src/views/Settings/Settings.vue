<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="pa-0">
        <v-tabs color="primary" left :value="currentTab">
          <NavTab v-for="item in children" :key="item.name" :item="item" />
        </v-tabs>
      </v-card-title>

      <transition name="slide-fade" mode="out-in">
        <router-view />
      </transition>
    </v-card>
  </v-container>
</template>

<script>
  /**
   * REQUIRED ROUTE: Settings
   */
  import { getRoutesByName } from '@cdcr/vue-frontend/router/helpers';
  import NavTab from '@cdcr/vue-frontend/components/layouts/navigation/helpers/NavTab.vue';

  export default {
    name: 'Settings',
    components: {
      NavTab,
    },
    data: () => ({
      /**
       * * NOTE: The route '/settings' renders all of it's children inside the <router-view/>
       * * When visiting this route, the DEFAULT_ROUTE_COMPONENT is shown.
       */
      DEFAULT_ROUTE_COMPONENT: 'Account',
    }),
    mounted() {
      if (this.$router.currentRoute.name === 'Settings') {
        this.$router.replace({ name: this.DEFAULT_ROUTE_COMPONENT });
      }
    },
    computed: {
      children() {
        const [currentRoute] = getRoutesByName('Settings');
        const children =
          currentRoute && Array.isArray(currentRoute.children)
            ? currentRoute.children
            : [];
        return children;
      },
      currentTab() {
        return this.children.findIndex((i) => i.name === this.$route.name);
      },
    },
  };
</script>
