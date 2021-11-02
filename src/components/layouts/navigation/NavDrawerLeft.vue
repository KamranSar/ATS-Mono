<template>
  <v-navigation-drawer
    v-model="leftDrawOpen"
    clipped
    hide-overlay
    app
    :mini-variant.sync="miniDraw"
    :key="loggedInUser.logincount"
    mini-variant-width="70"
    disable-resize-watcher
  >
    <!-- CAVEATS For Mini-Variant: https://vuetifyjs.com/en/components/navigation-drawers/#caveats -->
    <!-- When displaying the user toolbar the miniDraw variable drives what content gets shown due to real estate -->
    <!-- We hide the UserAvar in the toolbar and give it it's own ListItem in the mini-variant -->
    <!-- We don't display any of the app or user info at the bottom in the mini-variant-->
    <!-- We also correct some of the margins to center when going between variants -->
    <v-toolbar
      flat
      class="text-capitalize subtitle-2 grey--text"
      v-bind="$attrs"
      color="#ECEFF1"
    >
      <span class="text-truncate text-left">
        <UserAvatar v-if="isUserLoggedIn && !miniDraw"></UserAvatar>
        <span class="ml-2" v-if="!miniDraw">{{ displayName }}</span>
      </span>
      <v-btn
        color="primary"
        icon
        @click="miniDraw = !miniDraw"
        :class="miniDraw ? 'mr-auto' : 'ml-auto'"
        small
      >
        <v-icon>mdi-chevron-{{ miniDraw ? 'right' : 'left' }}</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list v-bind="$attrs">
      <!-- Left Navigation Items -->
      <template v-for="item in LeftNavItems">
        <NavListGroup
          v-if="item.children && item.children.length"
          :key="item.name"
          :group="item"
        ></NavListGroup>
        <NavListItem v-else :key="item.name" :item="item"></NavListItem>
      </template>

      <!-- PWA Install & Update -->
      <NavListItem
        v-if="!isRunningPWA()"
        :key="installItem.name"
        :item="installItem"
      ></NavListItem>
      <NavListItem
        v-if="updateExists"
        :key="updateItem.name"
        :item="updateItem"
      ></NavListItem>
    </v-list>

    <!-- Add your own v-list below -->
    <!--
    <v-list>
      <template v-for="item in items">
        <NavListGroup
          v-if="item.children && item.children.length"
          :key="item.name"
          :group="item"
        ></NavListGroup>
        <NavListItem v-else :key="item.name" :item="item"></NavListItem>
      </template>
    </v-list>
    -->

    <template v-slot:append>
      <transition-group name="fade" mode="in-out">
        <div
          key="user"
          class="text-right caption pa-1"
          v-if="$hasARole() && !miniDraw"
        >
          <div>
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
        <div
          key="app"
          class="text-right caption font-weight-regular pr-1 appversion"
          v-if="!miniDraw"
          v-on:dblclick="showApiVersion"
          v-touch="{ end: showApiVersion }"
        >
          {{ gitVersion }}
        </div>
      </transition-group>
    </template>
  </v-navigation-drawer>
</template>

<script>
  import { LeftNavItems } from '@/router/routes';
  import { defaultAdminRole } from '@/config/myApp.js';
  import Install from '@/mixins/Install.js'; // Function:isRunningPWA(), []:installItem
  import Update from '@/mixins/Update.js'; // Data(): updateExists; Function: update(), []:updateItem
  import UserAvatar from '@/components/util/UserAvatar.vue';
  import NavListItem from '@/components/layouts/navigation/helpers/NavListItem.vue';
  import NavListGroup from '@/components/layouts/navigation/helpers/NavListGroup.vue';
  import useVuexPathify from '@/compositions/useVuexPathify';
  import { myApp } from '@/config/myApp';
  import { computed } from '@vue/composition-api';
  import { showApiVersion } from '@/helpers/index.js';
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
      const leftDrawOpen = sync('devicePrefs/leftDrawOpen');
      const miniDraw = sync('devicePrefs/miniDraw');
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
          return 'Currently Logged Out';
        }
      });

      return {
        // Data
        leftDrawOpen,
        miniDraw,
        displayName,
        LeftNavItems,
        defaultAdminRole,
        loggedInUser,
        isUserLoggedIn,
        version,
        gitVersion,
        impersonatingSOMS,
        // Methods
        showApiVersion,
      };
    },
  };
</script>
