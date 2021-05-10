<template>
  <Panel icon="mdi-view-dashboard" title="Admin">
    <template slot="content">
      <router-view></router-view>
    </template>
  </Panel>
</template>

<script>
  import Panel from '@/components/layouts/Panel';
  export default {
    components: {
      Panel,
    },
  };
</script>
