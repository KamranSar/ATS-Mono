<template>
  <Panel icon="mdi-view-dashboard" title="Admin">
    <template slot="content">
      <v-container>
        This is a beautiful Admin Screen.
        {{ user }}
      </v-container>
    </template>
  </Panel>
</template>

<script>
  import Panel from '@/components/layouts/Panel';

  export default {
    components: { Panel },
  };
</script>
