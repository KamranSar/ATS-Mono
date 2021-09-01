<template>
  <div>
    <v-toolbar
      flat
      dense
      v-if="routeTitle"
      fill-height
      class="align-center ma-0 pa-0"
    >
      <v-toolbar-title class="title primary--text">
        <v-icon v-if="routeIcon" color="primary" class="mr-2">{{
          routeIcon
        }}</v-icon>
        <span color="primary" class="font-weight-bold">{{ routeTitle }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <slot name="toolbar-items"></slot>

      <template v-slot:extension v-if="extn">
        <slot name="toolbar-extn"></slot>
      </template>

      <v-progress-linear
        :active="loading"
        :loading="loading"
        :indeterminate="true"
        bottom
        absolute
        color="primary"
      />
    </v-toolbar>

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <slot name="content">No content</slot>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  /**
   * When importing Panel.vue, the content slot does not require a v-container.fluid
   * Ex. "@/views/Pricing.vue"
   * <template slot="content"> This is a beautiful Pricing page. </template>
   */
  import useVuexPathify from '@/compositions/useVuexPathify';
  import { reactive, ref } from '@vue/composition-api';
  import { getRoutesByName } from '@/router/routes';
  export default {
    name: 'panel',
    props: {
      title: String,
      icon: String,
      extn: Boolean,
    },
    setup(props, context) {
      const { get } = useVuexPathify(context);
      const loading = get('app/loading');
      const route = reactive({});
      const routeTitle = ref('');
      const routeIcon = ref('');
      return {
        loading,
        route,
        routeTitle,
        routeIcon,
      };
    },
    mounted() {
      this.getRoute();
    },
    methods: {
      getRoute() {
        let route =
          this.$route && this.$route.name
            ? getRoutesByName(this.$route.name)
            : [{ name: '', icon: '' }];

        this.route = route[0];
        this.routeTitle = this.title ? this.title : this.route.name;
        this.routeIcon = this.icon ? this.icon : this.route.icon;
      },
    },
  };
</script>
