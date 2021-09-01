<template>
  <v-list-group
    v-bind="$attrs"
    :no-action="child"
    :sub-group="child"
    :key="$route.fullPath"
    v-model="value"
    v-if="hasRoles"
  >
    <template v-slot:activator>
      <v-list-item-icon
        ><v-icon :color="getRouterColor(group)">{{
          group.icon
        }}</v-icon></v-list-item-icon
      >
      <v-list-item-content :class="`${getRouterColor(group)}--text`">
        <v-list-item-title>{{ group.name }}</v-list-item-title>
      </v-list-item-content>
    </template>
    <template v-for="(item, i) in group.children">
      <NavListGroup
        v-if="item.children"
        :key="i"
        :group="item"
        :child="true"
      ></NavListGroup>
      <NavListItem
        v-else
        :key="i"
        :item="item"
        :toolbar="toolbar"
      ></NavListItem>
    </template>
  </v-list-group>
</template>

<script>
  import NavListGroup from '@/components/layouts/navigation/helpers/NavListGroup.vue';
  import NavListItem from '@/components/layouts/navigation/helpers/NavListItem.vue';
  import Navigation from '@/mixins/Navigation.js'; // toolbar, anyRole, allRoles, showOrHide(), getRouterColor(), onClick()

  export default {
    name: 'NavListGroup',
    components: { NavListGroup, NavListItem },
    props: {
      group: {
        type: Object,
        required: true,
      },
      child: {
        type: Boolean,
        default: false,
      },
    },
    mixins: [Navigation],
  };
</script>
