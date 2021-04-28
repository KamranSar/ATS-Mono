<template>
  <v-footer v-bind="$attrs" dark class="grey--text">
    <v-row no-gutters>
      <v-col cols="12" align="center" justify="center" class="ma-auto">
        <v-btn
          v-for="link in anonymousItems"
          :key="link.title"
          color="white"
          text
          class="my-2"
          :to="link.path"
          >{{ link.name }}</v-btn
        >
      </v-col>

      <v-col cols="12">&nbsp;</v-col>

      <v-col cols="6" class="ma-auto text--grey caption">
        <span>© {{ new Date().getFullYear() }} CDCR</span>
      </v-col>
      <v-col
        cols="6"
        align="end"
        justify="end"
        class="ma-auto text--grey caption"
      >
        <Credits></Credits>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
  import { anonymousItems } from '@/config/navItems.js';
  export default {
    name: 'Footer',
    components: {
      Credits: () => import('@/components/Credits'),
    },
    data() {
      return {
        anonymousItems,
      };
    },
  };
</script>
