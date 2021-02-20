<template>
  <div>
    <v-footer dark class="grey--text pt-5">
      <v-row no-gutters>
        <v-col cols="12" align="center" justify="center" class="ma-auto">
          <v-btn
            v-for="link in anonNavItems"
            :key="link.title"
            color="white"
            text
            class="my-2"
            :to="link.to"
            >{{ link.title }}</v-btn
          >
        </v-col>

        <v-col cols="12">&nbsp;</v-col>

        <v-col cols="6" class="caption">© 2020-2021 CDCR.</v-col>
        <v-col
          cols="6"
          align="end"
          justify="end"
          class="ma-auto text--grey caption"
        >
          <span
            style="cursor: pointer; color: grey; text-decoration: underline"
            @click="creditsDialog = true"
          >
            <Credits @input="creditsDialog = false"></Credits> </span
          >&nbsp;| &nbsp;
          <a href="https://pragital.com" target="_blank" style="color: grey"
            >Pragital Powered.</a
          >
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
  export default {
    name: 'Footer',
    props: {
      anonItems: {
        type: Array,
        required: true,
      },
      anonNavItems: {
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
        creditsDialog: false,
        links: [
          { title: 'Home', to: { name: 'home' } },
          { title: 'Contact Us', to: { name: 'Contact Us' } },
          { title: 'Terms', to: { name: 'terms' } },
        ],
      };
    },
  };
</script>
