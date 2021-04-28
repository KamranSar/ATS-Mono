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
  import { get } from 'vuex-pathify';
  import Panel from '@/components/layouts/Panel';

  export default {
    components: { Panel },
    computed: {
      ...get('feathersAuthentication', ['user']),
    },
  };
</script>
