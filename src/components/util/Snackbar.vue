<template>
  <v-snackbar
    v-model="snackbar.show"
    :top="snackbar.top"
    :left="snackbar.left"
    :bottom="snackbar.bottom"
    :right="snackbar.right"
    :center="snackbar.center"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
  >
    <span v-html="snackbar.message" />

    <template v-slot:action="{ attrs }">
      <v-btn
        color="white"
        icon
        small
        v-bind="attrs"
        @click="snackbar.show = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
  import { sync } from 'vuex-pathify';

  export default {
    computed: {
      ...sync('app', ['snackbar']),
    },
  };
</script>
