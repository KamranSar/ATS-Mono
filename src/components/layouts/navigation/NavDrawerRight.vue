<template>
  <v-navigation-drawer
    v-model="rightDrawOpen"
    clipped
    hide-overlay
    app
    right
    disable-resize-watcher
    disable-route-watcher
  >
    <v-toolbar
      flat
      class="text-captialize subtitle-2 grey--text"
      dense
      color="#ECEFF1"
    >
      <v-btn icon small @click="rightDrawOpen = !rightDrawOpen">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <span>
        <v-icon class="mr-auto">{{ icon }}</v-icon>
        <span>{{ title }}</span>
      </span>
    </v-toolbar>

    <slot name="content"></slot>
  </v-navigation-drawer>
</template>

<script>
  import useVuexPathify from '@/compositions/useVuexPathify';
  export default {
    name: 'NavDrawerRight',
    props: {
      title: {
        type: String,
        default: '',
      },
      icon: {
        type: String,
        default: '',
      },
    },
    setup(props, context) {
      const { sync } = useVuexPathify(context);
      const rightDrawOpen = sync('userPrefs/rightDrawOpen');
      return { rightDrawOpen };
    },
  };
</script>
