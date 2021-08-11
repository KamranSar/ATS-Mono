<template>
  <!-- FIX: Add disable-route-watcher to fix router color not opening without having to toggle drawer -->
  <v-navigation-drawer
    v-model="leftDrawOpen"
    clipped
    hide-overlay
    app
    disable-resize-watcher
    disable-route-watcher
    :key="loggedInUser.logincount"
  >
    <v-toolbar
      flat
      class="text-capitalize subtitle-2 grey--text"
      dense
      color="#ECEFF1"
    >
      <span class="text-truncate mr-auto" v-if="isUserLoggedIn">
        <UserAvatar></UserAvatar>
        <span class="ml-2">{{ displayName }}</span>
      </span>
      <span class="text-truncate mr-auto" v-else>
        <span>Currently Logged Out</span>
      </span>
      <v-btn icon small @click="leftDrawOpen = !leftDrawOpen">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list v-if="isUserLoggedIn">
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

    <v-list
      v-if="
        loggedInUser &&
        loggedInUser.appuserroles &&
        loggedInUser.appuserroles.roles.includes(defaultAdminRole.name)
      "
    >
      <template v-for="item in adminItems">
        <NavListGroup
          v-if="item.children"
          :key="item.name"
          :group="item"
        ></NavListGroup>
        <NavListItem v-else :key="item.name" :item="item"></NavListItem>
      </template>
    </v-list>

    <!-- Add your own v-list below -->
    <!--
    <v-list>
      <template v-for="item in items">
        <NavListGroup
          v-if="item.children"
          :key="item.name"
          :group="item"
        ></NavListGroup>
        <NavListItem v-else :key="item.name" :item="item"></NavListItem>
      </template>
    </v-list>
    -->

    <v-list v-if="!isRunningPWA()">
      <NavListItem :key="installItem.name" :item="installItem"></NavListItem>
    </v-list>

    <v-list v-if="updateExists">
      <NavListItem :key="updateItem.name" :item="updateItem"></NavListItem>
    </v-list>

    <template v-slot:append>
      <div
        class="text-right caption pa-1"
        v-if="
          loggedInUser &&
          loggedInUser.appuserroles &&
          loggedInUser.appuserroles.roles
        "
      >
        <div v-if="loggedInUser.appuserroles.roles.length">
          <span
            v-for="role in loggedInUser.appuserroles.roles"
            :key="role"
            class="text-right"
          >
            {{ role }} <br />
          </span>
        </div>

        <router-link to="/signout" exact>Log in as another user</router-link>
      </div>

      <div class="text-right caption pa-1 font-weight-regular">
        {{ gitVersion }}
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
  import { anonymousItems, userItems, adminItems } from '@/router/routes';
  import { defaultAdminRole } from '@/config/myApp.js';
  import Install from '@/mixins/Install.js'; // Function:isRunningPWA(), []:installItem
  import Update from '@/mixins/Update.js'; // Data(): updateExists; Function: update(), []:updateItem
  import UserAvatar from '@/components/util/UserAvatar.vue';
  import NavListItem from '@/components/layouts/navigation/helpers/NavListItem.vue';
  import NavListGroup from '@/components/layouts/navigation/helpers/NavListGroup.vue';
  import useVuexPathify from '@/compositions/useVuexPathify';
  import { myApp } from '@/config/myApp';
  import { computed } from '@vue/composition-api';
  export default {
    name: 'NavDrawerLeft',
    components: {
      UserAvatar,
      NavListItem,
      NavListGroup,
    },
    mixins: [Install, Update],
    setup(props, context) {
      const { sync, get } = useVuexPathify(context);
      const leftDrawOpen = sync('userPrefs/leftDrawOpen');
      const loggedInUser = get('users/loggedInUser');
      const isUserLoggedIn = get('users/isUserLoggedIn');
      const version = myApp.version;
      const gitVersion = myApp.gitVersion;

      const impersonatingSOMS = computed(() => {
        if (
          loggedInUser.value.appuserroles &&
          loggedInUser.value.appuserroles.soms_upn &&
          loggedInUser.value.appuserroles.upn &&
          loggedInUser.value.appuserroles.soms_upn.toUpperCase() !==
            loggedInUser.value.appuserroles.upn.toUpperCase()
        ) {
          return true;
        } else {
          return false;
        }
      });

      const displayName = computed(() => {
        if (
          loggedInUser.value &&
          loggedInUser.value.somsinfo &&
          loggedInUser.value.somsinfo.displayName &&
          impersonatingSOMS.value
        ) {
          return loggedInUser.value.somsinfo.displayName;
        } else if (loggedInUser.value && loggedInUser.value.displayName) {
          return loggedInUser.value.displayName;
        } else {
          return '';
        }
      });

      return {
        leftDrawOpen,
        displayName,
        anonymousItems,
        userItems,
        adminItems,
        defaultAdminRole,
        loggedInUser,
        isUserLoggedIn,
        version,
        gitVersion,
        impersonatingSOMS,
      };
    },
  };
</script>
