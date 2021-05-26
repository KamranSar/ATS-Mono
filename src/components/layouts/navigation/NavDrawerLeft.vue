<template>
  <!-- FIX: Add disable-route-watcher to fix router color not opening without having to toggle drawer -->
  <v-navigation-drawer
    v-model="leftDrawOpen"
    clipped
    hide-overlay
    app
    disable-resize-watcher
    disable-route-watcher
  >
    <v-toolbar flat class="subtitle-2 grey--text" color="#ECEFF1">
      <span class="text-truncate">
        <UserAvatar v-if="isAzureLoggedIn"></UserAvatar>
        <span class="ml-2">{{
          displayName ? displayName : 'Currently Logged Out'
        }}</span>
      </span>
    </v-toolbar>

    <v-list v-if="isAzureLoggedIn">
      <template v-for="item in userItems">
        <NavListGroup
          v-if="item.children"
          :key="item.name"
          :group="item"
        ></NavListGroup>
        <NavListItem v-else :key="item.name" :item="item"></NavListItem>
      </template>
    </v-list>
    <v-list v-else>
      <template v-for="item in anonymousItems">
        <NavListGroup
          v-if="item.children"
          :key="item.name"
          :group="item"
        ></NavListGroup>
        <NavListItem v-else :key="item.name" :item="item"></NavListItem>
      </template>
    </v-list>

    <v-list v-can:if-admin>
      <template v-for="item in adminItems">
        <NavListGroup
          v-if="item.children"
          :key="item.name"
          :group="item"
        ></NavListGroup>
        <NavListItem v-else :key="item.name" :item="item"></NavListItem>
      </template>
    </v-list>

    <v-list v-can:if-user-manager>
      <template v-for="item in userMgmtItems">
        <NavListGroup
          v-if="item.children"
          :key="item.name"
          :group="item"
        ></NavListGroup>
        <NavListItem v-else :key="item.name" :item="item"></NavListItem>
      </template>
    </v-list>

    <v-list v-if="!isRunningPWA()">
      <NavListItem :key="installItem.name" :item="installItem"></NavListItem>
    </v-list>

    <template v-slot:append>
      <div class="text-right caption pa-1" v-if="isAzureLoggedIn">
        <router-link to="/signout" exact>Log in as another user</router-link>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
  import {
    anonymousItems,
    userItems,
    adminItems,
    getRoutesByName,
  } from '@/config/navItems';
  import Install from '@/mixins/Install.js'; // Function:isRunningPWA(), []:installItem
  import UserAvatar from '@/components/util/UserAvatar.vue';
  import NavListItem from '@/components/layouts/navigation/helpers/NavListItem.vue';
  import NavListGroup from '@/components/layouts/navigation/helpers/NavListGroup.vue';
  import useVuexPathify from '@/compositions/useVuexPathify';
  export default {
    name: 'NavDrawerLeft',
    components: {
      UserAvatar,
      NavListItem,
      NavListGroup,
    },
    mixins: [Install],
    setup(props, context) {
      const { sync, get } = useVuexPathify(context);
      const leftDrawOpen = sync('userPrefs/leftDrawOpen');
      const displayName = get('azureAuthentication/displayName');
      const isAzureLoggedIn = get('azureAuthentication/isAzureLoggedIn');
      const userMgmtItems = getRoutesByName(['Users']);
      return {
        leftDrawOpen,
        displayName,
        isAzureLoggedIn,
        anonymousItems,
        userItems,
        adminItems,
        userMgmtItems,
      };
    },
  };
</script>
