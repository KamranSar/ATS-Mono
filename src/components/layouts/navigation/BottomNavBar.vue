<template>
  <v-bottom-navigation app :value="value" color="blue" grow>
    <template v-if="isAzureLoggedIn">
      <v-btn v-for="(item, i) in userItems" :key="i" @click="onClick(item)">
        <span>{{ item.name }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </template>

    <template v-else>
      <v-btn
        v-for="(item, i) in anonymousItems"
        :key="i"
        @click="onClick(item)"
      >
        <span>{{ item.name }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </template>
  </v-bottom-navigation>
</template>

<script>
  import { get } from 'vuex-pathify';
  import { anonymousItems, userItems } from '@/config/navItems';
  import { onClick } from '@/router/helpers/index.js';
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
    },
  };
</script>
