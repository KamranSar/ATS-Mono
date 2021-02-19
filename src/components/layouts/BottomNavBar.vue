<template>
  <v-bottom-navigation :value="value" color="teal" grow>
    <!-- <v-btn
      v-for="link in links"
      :key="link.caption"
      color="white"
      text
      class="my-2"
      :to="link.to"
      >{{ link.caption }}</v-btn
    > -->

    <v-btn>
      <span>Recents</span>

      <v-icon>mdi-history</v-icon>
    </v-btn>

    <v-btn>
      <span>Favorites</span>

      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-btn>
      <span>Nearby</span>

      <v-icon>mdi-map-marker</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  export default {
    name: 'BottomNavBar',
    computed: {
      ...mapGetters('authentication', ['isLoggedIn', 'isOrgAdmin']),
      ...mapState('authentication', ['user']),
      ...mapState(['loading']),
      formattedUserId() {
        let userId = this.user && this.user.userid;
        if (userId && userId.length > 12)
          userId = `${this.user.userid.substr(0, 10)}..`;

        return userId;
      },
    },
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
    data: () => ({ value: 1 }),
    methods: {
      goGo(to) {
        this.$router.go(to);
      },
    },
  };
</script>
