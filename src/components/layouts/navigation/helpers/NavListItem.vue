<template>
  <v-list-item v-bind="$attrs" @click="onClick(item)">
    <v-list-item-title v-text="item.name"></v-list-item-title>
    <v-list-item-avatar>
      <v-icon color="item.iconColor">{{ item.icon }}</v-icon>
    </v-list-item-avatar>
  </v-list-item>
</template>

<script>
  import { onClick } from '@/router/helpers/index.js';
  export default {
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
    methods: {
      onClick,
    },
  };
</script>
