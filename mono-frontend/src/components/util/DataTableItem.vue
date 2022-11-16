<template>
  <router-link
    v-if="header.router"
    :key="header.value"
    :to="header.route(item)"
  >
    {{ header.route(item).title }}
  </router-link>

  <span v-else :key="header.text" :class="header.headerClass">{{
    header.format(item)
  }}</span>
</template>

<script>
  import DataTableHeader from '@/classes/DataTableHeader';
  export default {
    name: 'DataTableItem',
    props: {
      header: {
        type: DataTableHeader,
        required: true,
      },
      item: {
        type: Object,
        reuqired: true,
      },
    },
  };
</script>
