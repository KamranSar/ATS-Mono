<template>
  <v-bottom-navigation app :value="value" grow :key="$route.currentPath">
    <template v-if="isAzureLoggedIn">
      <v-btn v-for="(item, i) in userItems" :key="i" @click="onClick(item)">
        <span :class="`${getRouterColor(item)}--text`">{{ item.name }}</span>
        <v-icon :color="getRouterColor(item)">{{ item.icon }} </v-icon>
      </v-btn>
    </template>

    <template v-else>
      <v-btn
        v-for="(item, i) in anonymousItems"
        :key="i"
        @click="onClick(item)"
      >
        <span :class="`${getRouterColor(item)}--text`">{{ item.name }}</span>
        <v-icon :color="getRouterColor(item)">{{ item.icon }} </v-icon>
      </v-btn>
    </template>
  </v-bottom-navigation>
</template>

<script>
  import { get } from 'vuex-pathify';
  import { anonymousItems, userItems } from '@/config/navItems';
  import { onClick, getRouterColor } from '@/router/helpers/index.js';
  export default {
    name: 'BottomNavBar',
    computed: {
      ...get('azureAuthentication', {
        isAzureLoggedIn: 'isAzureLoggedIn',
      }),
      ...get('app', ['loading']),
    },
    data: () => ({
      anonymousItems,
      userItems,
      value: 1,
    }),
    methods: {
      onClick,
      getRouterColor,
    },
  };
</script>
