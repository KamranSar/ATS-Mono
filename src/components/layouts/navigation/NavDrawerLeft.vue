<template>
  <!-- FIX: Add disable-route-watcher to fix router color not opening without having to toggle drawer -->
  <v-navigation-drawer
    v-model="leftDrawOpen"
    clipped
    hide-overlay
    app
    :disable-route-watcher="true"
  >
    <v-toolbar flat class="subtitle-2 grey--text" color="#ECEFF1">
      <span class="text-truncate">
        <v-avatar class="mr-2" v-if="isAzureLoggedIn">
          <v-img
            v-if="myPhoto"
            max-height="46"
            max-width="46"
            :src="myPhoto"
          ></v-img>
          <v-icon v-else>mdi-account-circle</v-icon>
        </v-avatar>
        <span>{{ displayName ? displayName : 'Currently Logged Out' }}</span>
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

    <!-- FIXME: v-if="isOrgAdmin" -->
    <v-list>
      <template v-for="item in adminItems" v-can:is-admin>
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
      <p class="text-right caption pa-1 mb-n1">
        <router-link to="signout">Log in as another user</router-link>
      </p>
    </template>
  </v-navigation-drawer>
</template>

<script>
  import { anonymousItems, userItems, adminItems } from '@/config/navItems';
  import Install from '@/mixins/Install.js'; // Function:isRunningPWA(), []:installItem
  import NavListItem from '@/components/layouts/navigation/helpers/NavListItem.vue';
  import NavListGroup from '@/components/layouts/navigation/helpers/NavListGroup.vue';
  import useVuexPathify from '@/compositions/useVuexPathify';
  export default {
    name: 'NavDrawerLeft',
    components: {
      NavListItem,
      NavListGroup,
    },
    mixins: [Install],
    setup(props, context) {
      const { sync, get } = useVuexPathify(context);
      const leftDrawOpen = sync('userPrefs/leftDrawOpen');
      const myPhoto = get('azureAuthentication/myPhoto');
      const displayName = get('azureAuthentication/displayName');
      const isAzureLoggedIn = get('azureAuthentication/isAzureLoggedIn');
      return {
        leftDrawOpen,
        myPhoto,
        displayName,
        isAzureLoggedIn,
        anonymousItems,
        userItems,
        adminItems,
      };
    },
  };
</script>
