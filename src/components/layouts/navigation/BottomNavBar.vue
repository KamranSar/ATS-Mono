<template>
  <v-bottom-navigation app :value="value" color="blue" grow>
    <template v-if="isAzureLoggedIn">
      <v-btn v-for="(item, i) in userItems" :key="i" :to="item.path">
        <span>{{ item.name }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </template>

    <template v-else>
      <v-btn v-for="(item, i) in anonymousItems" :key="i" :to="item.path">
        <span>{{ item.name }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </template>

    <!-- <v-btn>
      <span>Nearby</span>
      <v-icon>mdi-map-marker</v-icon>
    </v-btn> -->
  </v-bottom-navigation>
</template>

<script>
  import { get } from 'vuex-pathify';
  import { anonymousItems, userItems } from '@/config/navItems';
  export default {
    name: 'BottomNavBar',
    computed: {
      ...get('azureAuthentication', {
        isAzureLoggedIn: 'isAzureLoggedIn',
      }),
      ...get('feathersAuthentication', {
        isFeathersLoggedIn: 'isFeathersLoggedIn',
        isAuthenticatePending: 'isAuthenticatePending',
      }),

      ...get('app', ['loading']),
      formattedUserId() {
        let userId = this.user && this.user.userid;
        if (userId && userId.length > 12)
          userId = `${this.user.userid.substr(0, 10)}..`;

        return userId;
      },
    },
    data: () => ({
      anonymousItems,
      userItems,
      value: 1,
    }),
    methods: {
      goGo(to) {
        this.$router.push(to);
      },
    },
  };
</script>
