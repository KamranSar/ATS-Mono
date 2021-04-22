<template>
  <v-footer app dark class="grey--text pt-5">
    <v-row no-gutters>
      <v-col cols="12" align="center" justify="center" class="ma-auto">
        <v-btn
          v-for="link in anonymousNavItems"
          :key="link.title"
          color="white"
          text
          class="my-2"
          :to="link.to"
          >{{ link.title }}</v-btn
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
  export default {
    name: 'Footer',
    props: {
      anonymousItems: {
        type: Array,
        required: true,
      },
      anonymousNavItems: {
        type: Array,
        required: true,
      },
      userItems: {
        type: Array,
        required: true,
      },
      adminItems: {
        type: Array,
        required: true,
      },
    },

    components: {
      Credits: () => import('../Credits'),
    },

    data() {
      return {
        links: [
          { title: 'Home', to: { name: 'home' } },
          { title: 'Contact Us', to: { name: 'Contact Us' } },
          { title: 'Terms', to: { name: 'terms' } },
        ],
      };
    },
  };
</script>
