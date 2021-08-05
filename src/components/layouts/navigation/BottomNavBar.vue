<template>
  <v-bottom-navigation app grow :key="$route.currentPath">
    <template v-if="isUserLoggedIn">
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
  import { anonymousItems, userItems } from '@/router/routes';
  import { onClick, getRouterColor } from '@/router/helpers/index.js';
  import useVuexPathify from '@/compositions/useVuexPathify';
  export default {
    name: 'BottomNavBar',
    setup(props, context) {
      const { get } = useVuexPathify(context);
      const isUserLoggedIn = get('users/isUserLoggedIn');
      const loading = get('app/loading');

      return {
        isUserLoggedIn,
        loading,
        anonymousItems,
        userItems,
        onClick,
        getRouterColor,
      };
    },
  };
</script>
