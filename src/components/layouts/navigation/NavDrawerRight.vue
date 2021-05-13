<template>
  <v-navigation-drawer v-model="rightDrawOpen" clipped hide-overlay app right>
    <v-toolbar flat class="subtitle-2 grey--text" dense color="#ECEFF1">
      <span>
        <v-icon class="mr-2">{{ icon }}</v-icon>
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
