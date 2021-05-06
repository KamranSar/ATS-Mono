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
  import { sync } from 'vuex-pathify';
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
    data() {
      return {};
    },
    computed: {
      ...sync('userPrefs', ['rightDrawOpen']),
    },
  };
</script>
