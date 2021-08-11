<template>
  <v-progress-circular
    color="primary"
    indeterminate
    v-if="loading"
  ></v-progress-circular>
  <v-badge v-else overlap color="transparent">
    <template v-slot:badge>
      <v-icon v-if="updateExists" class="pb-3" :color="updateItem.color">{{
        updateItem.icon
      }}</v-icon>
    </template>

    <v-avatar size="36">
      <v-img :src="imgLocation"></v-img>
    </v-avatar>
  </v-badge>
</template>

<script>
  import { get } from 'vuex-pathify';
  import Update from '@/mixins/Update.js'; // Data(): updateExists;

  export default {
    name: 'AppLogo',
    mixins: [Update],
    data: () => ({
      imgLocation: 'img/logo.svg',
    }),
    computed: {
      ...get('app', ['loading']),
    },
  };
</script>
