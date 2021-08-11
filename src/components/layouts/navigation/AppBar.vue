<template>
  <v-app-bar
    :clipped-left="true"
    :clipped-right="true"
    flat
    app
    min-height="65"
  >
    <v-app-bar-nav-icon @click="leftDrawOpen = !leftDrawOpen">
      <AppLogo></AppLogo>
    </v-app-bar-nav-icon>

    <span class="title ml-1">{{ $myApp.name }}</span>

    <v-spacer></v-spacer>

    <v-card color="transparent" class="hidden-md-and-down" flat>
      <v-btn-toggle group v-if="!isUserLoggedIn">
        <span v-for="(item, index) in anonymousItems" :key="index">
          <v-btn @click="onClick(item)" text :key="index">
            <v-icon :key="$route.fullPath" :color="getRouterColor(item)">{{
              item.icon
            }}</v-icon>
            {{ item.name }}
          </v-btn>
        </span>
      </v-btn-toggle>
    </v-card>

    <v-menu
      offset-y
      persistent
      :close-on-content-click="false"
      v-if="isUserLoggedIn"
    >
      <template v-slot:activator="{ on }">
        <v-btn text icon v-on="on">
          <UserAvatar></UserAvatar>
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
        <v-list-item>
          <v-list-item-title>Dark Mode</v-list-item-title>
          <v-list-item-action>
            <v-switch v-model="darkMode"></v-switch>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn @click="rightDrawOpen = !rightDrawOpen" icon>
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
  import { onClick, getRouterColor } from '@/router/helpers/index.js';
  import {
    anonymousItems,
    adminItems,
    userToolbarItems,
  } from '@/router/routes';
  import UserAvatar from '@/components/util/UserAvatar.vue';
  import AppLogo from '@/components/util/AppLogo.vue';
  import NavListItem from '@/components/layouts/navigation/helpers/NavListItem.vue';
  import NavListGroup from '@/components/layouts/navigation/helpers/NavListGroup.vue';
  import useVuexPathify from '@/compositions/useVuexPathify';
  import toTitleCase from '@/filters/toTitleCase';
  export default {
    components: {
      UserAvatar,
      AppLogo,
      NavListItem,
      NavListGroup,
    },
    setup(props, context) {
      const { sync, get } = useVuexPathify(context);
      const loading = sync('app/loading');
      const leftDrawOpen = sync('userPrefs/leftDrawOpen');
      const rightDrawOpen = sync('userPrefs/rightDrawOpen');
      const darkMode = sync('userPrefs/darkMode');
      const isUserLoggedIn = get('users/isUserLoggedIn');
      const toggleDarkMode = () => {
        context.root.$vuetify.theme.dark = darkMode.value;
      };
      return {
        // Data
        loading,
        leftDrawOpen,
        rightDrawOpen,
        darkMode,
        isUserLoggedIn,
        // Methods
        anonymousItems,
        adminItems,
        userToolbarItems,
        onClick,
        getRouterColor,
        toggleDarkMode,
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.toggleDarkMode();
      });
    },
    filters: {
      toTitleCase,
    },
    watch: {
      darkMode: {
        immediate: true,
        handler: 'toggleDarkMode',
      },
    },
  };
</script>
<style scoped>
  .v-toolbar__extension {
    padding: 0px !important;
  }
</style>
