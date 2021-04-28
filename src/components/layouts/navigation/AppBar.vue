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
          src="@/assets/logo.svg"
          contain
          max-height="36"
          max-width="36"
          alt="logo"
        />
      </v-avatar>
    </v-app-bar-nav-icon>

    <router-link :to="{ name: 'Home' }"> </router-link>

    <span class="title ml-1">{{ $myApp.name }}</span>

    <v-spacer></v-spacer>

    <v-card color="transparent" class="hidden-md-and-down" flat>
      <v-btn-toggle group v-if="!isAzureLoggedIn">
        <span v-for="(item, index) in anonymousItems" :key="index">
          <v-btn :to="item.path" text :key="index">
            <v-icon color="item.iconColor">{{ item.icon }}</v-icon>
            {{ item.name }}
          </v-btn>
        </span>
      </v-btn-toggle>
    </v-card>

    <v-card color="transparent" flat v-if="isAzureLoggedIn">
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn text icon v-on="on">
            <v-avatar v-if="myPhoto">
              <v-img max-height="32" max-width="32" :src="myPhoto"></v-img>
            </v-avatar>
            <v-icon v-else color="darker">mdi-account-circle</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, index) in userToolbarItems"
            dense
            :key="'u' + index"
            :to="item.path"
          >
            <v-list-item-avatar>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card>

    <v-btn text v-if="rightDrawEnabled" @click="rightDrawOpen = !rightDrawOpen">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
  import { sync, get } from 'vuex-pathify';
  import {
    anonymousItems,
    userItems,
    adminItems,
    userToolbarItems,
  } from '@/config/navItems';
  export default {
    data() {
      return {
        anonymousItems,
        userItems,
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
        myInfo: 'myInfo',
        myPhoto: 'myPhoto',
        myPhotoMetaData: 'myPhotoMetaData',
        localAccountId: 'localAccountId',
        displayName: 'displayName',
        isAzureLoggedIn: 'isAzureLoggedIn',
        azureLoading: 'azureLoading',
      }),
      ...get('feathersAuthentication', {
        isFeathersLoggedIn: 'isFeathersLoggedIn',
        isAuthenticatePending: 'isAuthenticatePending',
      }),
    },
  };
</script>
<style scoped>
  .v-toolbar__extension {
    padding: 0px !important;
  }
</style>
