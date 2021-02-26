<template>
  <v-bottom-navigation :value="value" color="blue" grow>
    <template v-if="isLoggedIn">
      <v-btn v-for="(item, i) in userItems" :key="i" :to="item.to">
        <span>{{ item.title }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </template>

    <template v-else>
      <v-btn v-for="(item, i) in anonNavItems" :key="i" :to="item.to">
        <span>{{ item.title }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </template>

    <!--<v-btn>
      <span>Nearby</span>
      <v-icon>mdi-map-marker</v-icon>
    </v-btn> -->
  </v-bottom-navigation>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  export default {
    name: 'BottomNavBar',
    computed: {
      ...mapGetters('authentication', ['isLoggedIn', 'isOrgAdmin']),
      ...mapState('authentication', ['user']),
      ...mapState('app', ['loading']),
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
