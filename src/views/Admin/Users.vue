<template>
  <v-container>
    This is a beautiful Users Screen.
    {{ user }}
  </v-container>
</template>

<script>
  import { sync } from 'vuex-pathify';

  export default {
    computed: {
      ...sync('FeathersAuthentication', ['user']),
    },
  };
</script>
