<template>
  <v-btn @click="onClick(item)" text v-if="hasRoles || hasException">
    <v-icon :key="$route.fullPath" :color="getRouterColor(item)">{{
      item.icon
    }}</v-icon>
    {{ item.name }}
  </v-btn>
</template>

<script>
  import Navigation from '@/mixins/Navigation.js';

  export default {
    name: 'NavButton',
    props: {
      item: { type: Object, required: true },
    },
    mixins: [Navigation],

    setup() {
      return {};
    },
  };
</script>

<style lang="scss" scoped></style>
