<template>
  <v-tab v-if="hasRoles || hasException" @click="onClick(item)" v-bind="$attrs">
    <v-row no-gutters align="center" justify="center">
      <v-icon> {{ item.icon }} </v-icon>
      <div class="ml-2">{{ item.name }}</div>
    </v-row>
  </v-tab>
</template>

<script>
  import Navigation from '@/mixins/Navigation.js';

  export default {
    name: 'NavButton',
    props: {
      item: { type: Object, required: true },
    },
    mixins: [Navigation],
  };
</script>
