<template>
  <v-app-bar
    :clipped-left="clippedLeft"
    :clipped-right="clippedRight"
    flat
    app
    min-height="65"
  >
    <v-app-bar-nav-icon
      v-if="leftDrawEnabled"
      @click="leftDrawOpen = !leftDrawOpen"
    >
      <v-avatar>
        <v-img
          src="/img/logo.svg"
          contain
          max-height="36"
          max-width="36"
          alt="logo"
        />
      </v-avatar>
    </v-app-bar-nav-icon>

    <span class="title ml-1">{{ $myApp.name }}</span>

    <v-spacer></v-spacer>

    <v-card color="transparent" class="hidden-md-and-down" flat>
      <v-btn-toggle group v-if="!isAzureLoggedIn">
        <span v-for="(item, index) in anonymousItems" :key="index">
          <v-btn @click="onClick(item)" text :key="index">
            <v-icon :color="getRouterColor(item)">{{ item.icon }}</v-icon>
            {{ item.name }}
          </v-btn>
        </span>
      </v-btn-toggle>
    </v-card>

    <v-card color="transparent" flat v-if="isAzureLoggedIn">
      <v-menu offset-y persistent :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-btn text icon v-on="on">
            <v-avatar v-if="myPhoto">
              <v-img max-height="32" max-width="32" :src="myPhoto"></v-img>
            </v-avatar>
            <v-icon v-else color="darker">fa-user-circle</v-icon>
          </v-btn>
        </template>

        <v-list>
          <template v-for="(item, i) in userToolbarItems">
            <NavListGroup
              v-if="item.children"
              :key="i"
              :group="item"
            ></NavListGroup>
            <NavListItem v-else :key="i" :item="item"></NavListItem>
          </template>
        </v-list>
      </v-menu>
    </v-card>

    <v-btn
      text
      v-if="rightDrawEnabled && isAzureLoggedIn"
      @click="rightDrawOpen = !rightDrawOpen"
    >
      <v-icon>fa-bars</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
  import { onClick, getRouterColor } from '@/router/helpers/index.js';
  import { sync, get } from 'vuex-pathify';
  import {
    anonymousItems,
    adminItems,
    userToolbarItems,
  } from '@/config/navItems';
  import NavListItem from '@/components/layouts/navigation/helpers/NavListItem.vue';
  import NavListGroup from '@/components/layouts/navigation/helpers/NavListGroup.vue';
  export default {
    components: {
      NavListItem,
      NavListGroup,
    },
    data() {
      return {
        anonymousItems,
        adminItems,
        userToolbarItems,
        clippedLeft: true,
        clippedRight: true,
      };
    },
    computed: {
      ...sync('userprefs', ['leftDrawOpen', 'rightDrawOpen']),
      ...get('appfeatures', ['leftDrawEnabled', 'rightDrawEnabled']),
      ...get('azureAuthentication', {
        myPhoto: 'myPhoto',
        isAzureLoggedIn: 'isAzureLoggedIn',
      }),
    },
    methods: {
      onClick,
      getRouterColor,
    },
  };
</script>
<style scoped>
  .v-toolbar__extension {
    padding: 0px !important;
  }
</style>
