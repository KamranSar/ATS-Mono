<template>
  <v-list-item v-bind="$attrs" @click="onClick(item)">
    <v-list-item-title :class="`${getRouterColor(item)}--text`">{{
      item.name
    }}</v-list-item-title>
    <v-list-item-icon>
      <v-icon :color="getRouterColor(item)">{{ item.icon }}</v-icon>
    </v-list-item-icon>
  </v-list-item>
</template>

<script>
  import { onClick, getRouterColor } from '@/router/helpers/index.js';
  export default {
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
    methods: {
      onClick,
      getRouterColor,
    },
  };
</script>
