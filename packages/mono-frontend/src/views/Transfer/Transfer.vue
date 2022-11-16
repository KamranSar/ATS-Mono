<template>
  <v-card flat class="mb-12" v-bind="$attrs">
    <!-- <v-card elevation="3" class="ma-4 px-4 pb-8" v-bind="$attrs"> -->
    <TransferSearch />
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      color="primary"
    ></v-progress-linear>
    <v-divider></v-divider>
  </v-card>
</template>

<script>
  import { sync } from 'vuex-pathify';
  import TransferSearch from '@/components/Transfer/TransferSearch.vue';
  export default {
    name: 'Transfer',
    components: {
      TransferSearch,
    },
    data: () => ({}),
    computed: {
      ...sync('app', ['loading']),
    },
  };
</script>
