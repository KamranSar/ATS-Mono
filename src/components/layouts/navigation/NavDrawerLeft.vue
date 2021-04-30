<template>
  <div>
    <v-banner v-if="deferredPrompt" color="info" dark class="text-left">
      Get our free app. It won't take up space on your phone and also works
      offline!

      <template v-slot:actions>
        <v-btn text @click="dismiss">Dismiss</v-btn>
        <v-btn text @click="install">Install</v-btn>
      </template>
    </v-banner>

    <v-toolbar flat class="subtitle-2 grey--text" color="#ECEFF1">
      <span class="text-truncate">
        <v-avatar class="mr-2" v-if="isAzureLoggedIn">
          <v-img
            v-if="myPhoto"
            max-height="46"
            max-width="46"
            :src="myPhoto"
          ></v-img>
          <v-icon v-else>fa-user-circle</v-icon>
        </v-avatar>
        <span>{{ displayName ? displayName : 'Currently Logged Out' }}</span>
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

    <v-list>
      <template v-for="(item, i) in fixedNavItems">
        <NavListGroup
          v-if="item.children"
          :key="i"
          :group="item"
        ></NavListGroup>
        <NavListItem v-else :key="i" :item="item"></NavListItem>
      </template>
    </v-list>
  </div>
</template>

<script>
  import { get } from 'vuex-pathify';
  import {
    getRoutesByName,
    anonymousItems,
    userItems,
    adminItems,
  } from '@/config/navItems';
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
        myPhoto: 'myPhoto',
        displayName: 'displayName',
        isAzureLoggedIn: 'isAzureLoggedIn',
      }),
      ...get('feathersAuthentication', {
        isOrgAdmin: 'isOrgAdmin',
      }),
      fixedNavItems() {
        return getRoutesByName(['CDCR Dashboard', 'Install App']);
      },
    },
    data() {
      return {
        anonymousItems,
        userItems,
        adminItems,
        deferredPrompt: null,
      };
    },
    created() {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        // Stash the event so it can be triggered later.
        this.deferredPrompt = e;
      });
      window.addEventListener('appinstalled', () => {
        this.deferredPrompt = null;
      });
    },
    methods: {
      async dismiss() {
        this.deferredPrompt = null;
      },
      async install() {
        this.deferredPrompt.prompt();
      },
    },
  };
</script>
