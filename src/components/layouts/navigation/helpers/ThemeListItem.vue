<template>
  <!-- Dark/Light Mode Toggle -->
  <v-list-item>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-list-item-title v-on="on" v-bind="attrs"
          >Dark Mode</v-list-item-title
        >
      </template>
      <span class="white--text"> Force dark or light mode. </span>
    </v-tooltip>
    <v-list-item-action>
      <v-switch @click="toggleTheme()" v-model="darkMode"></v-switch>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
  import { sync, call } from 'vuex-pathify';
  export default {
    name: 'ThemeListItem',
    computed: {
      ...sync('userPrefs', ['deviceTheme']),
      ...sync('devicePrefs', ['darkMode']),
    },
    methods: {
      ...call('userPrefs', ['saveUserPrefs']),
      toggleTheme() {
        if (this.deviceTheme) {
          this.deviceTheme = false;
          this.saveUserPrefs();
        }
      },
    },
  };
</script>
