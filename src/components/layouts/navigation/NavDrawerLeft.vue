<template>
  <div>
    <v-toolbar flat class="subtitle-2 grey--text" color="#ECEFF1">
      <span class="font-weight-bold text-truncate">
        <v-avatar class="mr-2" v-if="isAzureLoggedIn">
          <v-img
            v-if="myPhoto"
            max-height="46"
            max-width="46"
            :src="myPhoto"
          ></v-img>
          <v-icon v-else>mdi-account-circle</v-icon>
        </v-avatar>
        <span>{{ displayName }}</span>
      </span>
    </v-toolbar>

    <v-list v-if="isAzureLoggedIn">
      <template v-for="(item, i) in userItems">
        <NavListGroup
          v-if="item.children"
          :key="i"
          :group="item"
        ></NavListGroup>
        <NavListItem v-else :key="i" :item="item"></NavListItem>
      </template>
    </v-list>

    <v-list v-else>
      <template v-for="(item, i) in anonymousItems">
        <NavListGroup
          v-if="item.children"
          :key="i"
          :group="item"
        ></NavListGroup>
        <NavListItem v-else :key="i" :item="item"></NavListItem>
      </template>
    </v-list>

    <span v-if="isOrgAdmin">
      <v-list>
        <template v-for="(item, i) in adminItems">
          <NavListGroup
            v-if="item.children"
            :key="i"
            :group="item"
          ></NavListGroup>
          <NavListItem v-else :key="i" :item="item"></NavListItem>
        </template>
      </v-list>
    </span>
  </div>
</template>

<script>
  import { get } from 'vuex-pathify';
  import { anonymousItems, userItems, adminItems } from '@/config/navItems';
  import NavListItem from '@/components/layouts/navigation/helpers/NavListItem.vue';
  import NavListGroup from '@/components/layouts/navigation/helpers/NavListGroup.vue';
  export default {
    name: 'NavDrawerLeft',
    components: {
      NavListItem,
      NavListGroup,
    },
    computed: {
      ...get('azureAuthentication', {
        myInfo: 'myInfo',
        myPhoto: 'myPhoto',
        myPhotoMetaData: 'myPhotoMetaData',
        localAccountId: 'localAccountId',
        displayName: 'displayName',
        isAzureLoggedIn: 'isAzureLoggedIn',
      }),
      ...get('feathersAuthentication', {
        isFeathersLoggedIn: 'isFeathersLoggedIn',
        isAuthenticatePending: 'isAuthenticatePending',
        user: 'user',
        isOrgAdmin: 'isOrgAdmin',
      }),

      ...get('app', ['loading']),

      formattedUserId() {
        let userId = this.user && this.user.userid;
        if (userId && userId.length > 12)
          userId = `${this.user.userid.substr(0, 10)}..`;

        return userId;
      },
    },
    data() {
      return {
        anonymousItems,
        userItems,
        adminItems,
      };
    },
    methods: {
      goGo(to) {
        this.$router.push(to);
      },
    },
  };
</script>
