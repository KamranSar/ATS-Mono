<template>
  <v-list-group
    v-bind="$attrs"
    :value="true"
    :key="group.name"
    :prepend-icon="child ? null : group.icon"
    :color="group.color"
    :no-action="child"
    :sub-group="child"
  >
    <template v-slot:activator>
      <v-list-item-content>
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
      <NavListItem v-else :key="i" :item="item"></NavListItem>
    </template>
  </v-list-group>
</template>

<script>
  import NavListGroup from '@/components/layouts/navigation/helpers/NavListGroup.vue';
  import NavListItem from '@/components/layouts/navigation/helpers/NavListItem.vue';
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
  };
</script>
