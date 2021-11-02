<template>
  <v-list-item
    v-bind="$attrs"
    @click="onClick(item)"
    v-if="hasRoles || hasException"
    v-model="value"
    color="primary"
  >
    <!-- Force list-item-icon to show up on the left by hiding the title when mini draw variant in active -->
    <v-list-item-title v-if="!miniDraw || toolbar">{{
      item.name
    }}</v-list-item-title>
    <v-list-item-icon>
      <v-icon>{{ item.icon }}</v-icon>
    </v-list-item-icon>
  </v-list-item>
</template>

<script>
  import Navigation from '@/mixins/Navigation.js';

  import { get } from 'vuex-pathify';
  export default {
    name: 'NavListItem',
    props: {
      toolbar: {
        type: Boolean,
        required: false,
        default: false,
      },
      item: {
        type: Object,
        required: true,
      },
    },
    mixins: [Navigation],
    computed: {
      ...get('devicePrefs', ['miniDraw']),
    },
  };
</script>
