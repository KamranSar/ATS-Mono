<template>
  <v-progress-circular
    color="primary"
    indeterminate
    v-if="loading"
  ></v-progress-circular>
  <v-btn
    v-else-if="!loading && $vuetify.breakpoint.mdAndUp"
    icon
    @click="$router.go()"
  >
    <v-avatar size="36">
      <v-img :src="imgLocation"></v-img>
    </v-avatar>
  </v-btn>
</template>

<script>
  import { get } from 'vuex-pathify';
  import Update from '@/mixins/Update.js'; // Data(): updateExists;

  export default {
    name: 'AppLogo',
    mixins: [Update],
    data: () => ({
      imgLocation: '/img/logo.svg',
    }),
    computed: {
      ...get('app', ['loading']),
    },
  };
</script>
