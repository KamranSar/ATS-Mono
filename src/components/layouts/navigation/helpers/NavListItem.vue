<template>
  <v-list-item v-bind="$attrs" @click="onClick" link>
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
    methods: {
      onClick() {
        if (this.item.path) {
          this.$router.push(this.item.path);
        } else if (this.item.onclick) {
          this.item.onclick();
        }
      },
    },
  };
</script>
