<template>
  <v-bottom-navigation :value="value" color="blue" grow>
    <template v-if="isAzureLoggedIn">
      <v-btn v-for="(item, i) in userItems" :key="i" :to="item.to">
        <span>{{ item.title }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </template>

    <template v-else>
      <v-btn v-for="(item, i) in anonymousNavItems" :key="i" :to="item.to">
        <span>{{ item.title }}</span>
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

  import { mapGetters, mapState } from 'vuex';
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

      ...mapGetters('authentication', ['isOrgAdmin']),
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
    data: () => ({ value: 1 }),
    methods: {
      goGo(to) {
        this.$router.push(to);
      },
    },
  };
</script>
