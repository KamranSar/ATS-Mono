<template>
  <Panel icon="mdi-view-dashboard" title="Dashboard">
    <template slot="content">
      <v-container>
        This is a beautiful dashboard.
        {{ user }}
      </v-container>
      <Footer app></Footer>
    </template>
  </Panel>
</template>

<script>
  // import { mapGetters } from 'vuex';
  import { get, call } from 'vuex-pathify';
  import Panel from '@/components/layouts/Panel';

  export default {
    components: { Panel, Footer: () => import('@/components/layouts/Footer') },
    computed: {
      ...get('feathersAuthentication', ['user']),
    },
  };
</script>
