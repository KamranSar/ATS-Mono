<template>
  <v-app-bar clipped-left clipped-right flat app dense>
    <Watermark />

    <!-- Left Navigation Icon -->
    <v-badge
      overlap
      offset-y="20"
      style="z-index: 1"
      :color="updateItem.color"
      :icon="updateItem.icon"
      :value="updateExists"
      v-if="LEFT_DRAW_ENABLED"
    >
      <v-btn large icon @click="leftDrawOpen = !leftDrawOpen">
        <v-icon v-if="leftDrawOpen">mdi-backburger</v-icon>
        <v-icon v-else>mdi-menu</v-icon>
      </v-btn>
    </v-badge>

    <!-- Application Logo & Name -->
    <AppLogo></AppLogo>
    <span class="title ml-1">{{ $myApp.name }}</span>

    <v-spacer></v-spacer>

    <v-card color="transparent" class="hidden-md-and-down" flat>
      <v-btn-toggle group>
        <NavButton
          v-for="(item, index) in TopNavItems"
          :item="item"
          :key="index"
        >
        </NavButton>
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
          <UserAvatar />
        </v-btn>
      </template>

      <v-list>
        <!-- Toolbar Items -->
        <template v-for="(item, i) in ToolbarItems">
          <NavListGroup
            v-if="item.children"
            :key="i"
            :group="item"
            :toolbar="true"
          ></NavListGroup>
          <NavListItem
            v-else
            :key="i"
            :item="item"
            :toolbar="true"
          ></NavListItem>
        </template>

        <!-- Dark/Light Mode Toggle -->
        <ThemeListItem />
      </v-list>
    </v-menu>

    <!-- Right Navigation Icon -->
    <v-btn
      @click="rightDrawOpen = !rightDrawOpen"
      icon
      v-if="RIGHT_DRAW_ENABLED && isUserLoggedIn"
    >
      <v-icon v-if="rightDrawOpen">mdi-backburger mdi-rotate-180</v-icon>
      <v-icon v-else>mdi-menu</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
  import getRouterColor from '@/router/helpers/getRouterColor.js';
  import onClick from '@/router/helpers/onClick.js';
  import { TopNavItems, ToolbarItems } from '@/router/routes';
  import UserAvatar from '@/components/util/UserAvatar.vue';
  import AppLogo from '@/components/util/AppLogo.vue';
  import Watermark from '@/components/util/Watermark.vue';
  import ThemeListItem from '@/components/layouts/navigation/helpers/ThemeListItem.vue';
  import NavListItem from '@/components/layouts/navigation/helpers/NavListItem.vue';
  import NavListGroup from '@/components/layouts/navigation/helpers/NavListGroup.vue';
  import NavButton from '@/components/layouts/navigation/helpers/NavButton.vue';
  import useVuexPathify from '@/compositions/useVuexPathify';
  import toTitleCase from '@/helpers/toTitleCase';
  import Update from '@/mixins/Update';
  import {
    LEFT_DRAW_ENABLED,
    RIGHT_DRAW_ENABLED,
    BOTTOM_BAR_ENABLED,
  } from '@/config/appFeatures.js';
  export default {
    components: {
      UserAvatar,
      AppLogo,
      ThemeListItem,
      NavListItem,
      NavListGroup,
      NavButton,
      Watermark,
    },
    mixins: [Update],
    setup(props, context) {
      const { sync, get } = useVuexPathify(context);
      const loading = sync('app/loading');
      const leftDrawOpen = sync('devicePrefs/leftDrawOpen');
      const rightDrawOpen = sync('devicePrefs/rightDrawOpen');
      const darkMode = sync('devicePrefs/darkMode');
      const deviceTheme = get('userPrefs/deviceTheme');
      const isUserLoggedIn = get('users/isUserLoggedIn');
      const toggleDarkMode = () => {
        context.root.$vuetify.theme.dark = darkMode.value;
      };
      const watchDeviceTheme = (deviceTheme) => {
        if (deviceTheme) {
          darkMode.value = window.matchMedia(
            '(prefers-color-scheme: dark)'
          ).matches;
        }
      };

      return {
        // Data
        loading,
        TopNavItems,
        ToolbarItems,
        leftDrawOpen,
        rightDrawOpen,
        darkMode,
        deviceTheme,
        isUserLoggedIn,
        LEFT_DRAW_ENABLED,
        RIGHT_DRAW_ENABLED,
        BOTTOM_BAR_ENABLED,
        // Methods
        onClick,
        getRouterColor,
        toggleDarkMode,
        watchDeviceTheme,
      };
    },
    filters: {
      toTitleCase,
    },
    // darkMode needs to be watched on AppBar since ThemeListItem is lazyloaded
    // deviceTheme needs to be watched to reflect the change.
    watch: {
      darkMode: {
        immediate: true,
        handler: 'toggleDarkMode',
      },
      deviceTheme: {
        immediate: true,
        handler: 'watchDeviceTheme',
      },
    },
  };
</script>
