<template>
  <v-list-item
    v-bind="$attrs"
    v-model="value"
    @click="onClick(item)"
    :key="$route.fullPath"
    v-if="hasRoles"
  >
    <!-- Force list-item-icon to show up on the left by hiding the title when mini draw variant in active -->
    <v-list-item-title
      v-if="!miniDraw || toolbar"
      :class="`${getRouterColor(item)}--text`"
      >{{ item.name }}</v-list-item-title
    >
    <v-list-item-icon>
      <v-icon :color="getRouterColor(item)">{{ item.icon }}</v-icon>
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
      ...get('userPrefs', ['miniDraw']),
    },
  };
</script>
