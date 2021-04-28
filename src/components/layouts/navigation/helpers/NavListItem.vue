<template>
  <v-list-item v-bind="$attrs" :to="item.path" link>
    <v-list-item-title v-text="item.name"></v-list-item-title>
    <v-list-item-avatar>
      <v-icon color="item.iconColor">{{ item.icon }}</v-icon>
    </v-list-item-avatar>
  </v-list-item>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
  };
</script>
